export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  // "de-DE" formats dates in German style, e.g. "27. Juni 2025, 14:32"
  return date.toLocaleString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
