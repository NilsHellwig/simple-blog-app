import { Ollama } from "ollama";
import { z } from "zod";

// On the host machine Ollama listens on localhost; inside the backend's Docker
// container "localhost" would point at the container itself, so OLLAMA_HOST
// must be overridden (e.g. to http://host.docker.internal:11434) in that case.
const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || "http://127.0.0.1:11434",
});
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma3:4b";

// Structured output schema: Ollama is instructed to return JSON matching this
// shape, so the response can be parsed and validated with zod on arrival.
export const postSuggestionSchema = z.object({
  description: z.string().describe("Eine ansprechende Blogpost-Beschreibung in 1-3 Sätzen."),
  tags: z
    .array(z.string().min(1).max(24))
    .min(1)
    .max(5)
    .describe("1 bis 5 kurze, thematisch passende Schlagwörter (je maximal 2 Wörter, ohne '#')."),
});

// Small local models sometimes cram several tags into one array slot when they
// run out of room (e.g. `Tokio", "Osaka", `), using typographic quotes so the
// JSON stays technically valid. Splitting on quote/comma characters recovers
// the individual tags from that.
const sanitizeTags = (tags) => {
  const cleaned = tags
    .flatMap((tag) => tag.split(/["“”,]+/))
    .map((tag) => tag.trim())
    .filter(Boolean);
  return [...new Set(cleaned)].slice(0, 5);
};

// Asks the local Ollama model for a description + tag suggestion based on a post title.
export const suggestPostContent = async (title) => {
  const response = await ollama.chat({
    model: OLLAMA_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You help write blog posts. Given a title, generate a matching description and " +
          "thematic tags. Always reply in the same language the title is written in.",
      },
      { role: "user", content: `Titel des Blogposts: "${title}"` },
    ],
    format: z.toJSONSchema(postSuggestionSchema),
  });

  const suggestion = postSuggestionSchema.parse(JSON.parse(response.message.content));
  return { ...suggestion, tags: sanitizeTags(suggestion.tags) };
};
