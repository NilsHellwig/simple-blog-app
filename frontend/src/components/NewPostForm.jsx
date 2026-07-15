import { ChatCircleIcon, SparkleIcon, XIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { addNewPost, suggestPostContent } from "../api";

function NewPostForm({ setPosts }) {
  const fileInputRef = useRef();
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    imageBase64: "",
    tags: [],
  });
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [editingTagIndex, setEditingTagIndex] = useState(null);
  const [editingTagValue, setEditingTagValue] = useState("");

  const updateNewPost = (key, value) => {
    setNewPost((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addNewPost(newPost, setPosts);
    if (success) {
      setNewPost({ title: "", description: "", imageBase64: "", tags: [] });
      setTagInput("");
      setEditingTagIndex(null);
      fileInputRef.current.value = "";
    }
  };

  const handleSuggest = async () => {
    if (!newPost.title) {
      alert("Please enter a title first.");
      return;
    }

    setIsSuggesting(true);
    const suggestion = await suggestPostContent(newPost.title);
    setIsSuggesting(false);

    if (suggestion) {
      updateNewPost("description", suggestion.description);
      updateNewPost("tags", suggestion.tags);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !newPost.tags.includes(tag)) {
      updateNewPost("tags", [...newPost.tags, tag]);
    }
    setTagInput("");
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (index) => {
    updateNewPost(
      "tags",
      newPost.tags.filter((_, i) => i !== index)
    );
  };

  const startEditingTag = (index) => {
    setEditingTagIndex(index);
    setEditingTagValue(newPost.tags[index]);
  };

  const saveEditingTag = () => {
    const value = editingTagValue.trim();
    const tags = [...newPost.tags];
    if (value) {
      tags[editingTagIndex] = value;
    } else {
      tags.splice(editingTagIndex, 1);
    }
    updateNewPost("tags", tags);
    setEditingTagIndex(null);
  };

  const handleTagEditKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEditingTag();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setEditingTagIndex(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      // readAsDataURL converts the file to a base64-encoded data URL (e.g. "data:image/png;base64,...")
      reader.onloadend = () => {
        updateNewPost("imageBase64", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={newPost.title}
        onChange={(e) => updateNewPost("title", e.target.value)}
        required
      />
      <button type="button" id="ai-suggest-button" onClick={handleSuggest} disabled={isSuggesting}>
        <span>{isSuggesting ? "Generating..." : "Suggest description with AI"}</span>
        <SparkleIcon size={20} />
      </button>
      <textarea
        placeholder="Description"
        value={newPost.description}
        onChange={(e) => updateNewPost("description", e.target.value)}
        required
      />
      <div id="tag-editor">
        {newPost.tags.length > 0 && (
          <ul className="tag-list">
            {newPost.tags.map((tag, index) =>
              editingTagIndex === index ? (
                <li key={index}>
                  <input
                    className="tag-edit-input"
                    value={editingTagValue}
                    autoFocus
                    onChange={(e) => setEditingTagValue(e.target.value)}
                    onKeyDown={handleTagEditKeyDown}
                  />
                </li>
              ) : (
                <li key={index}>
                  <span onClick={() => startEditingTag(index)}>#{tag}</span>
                  <button
                    type="button"
                    className="tag-remove-button"
                    onClick={() => removeTag(index)}
                    aria-label={`Remove tag ${tag}`}
                  >
                    <XIcon size={12} />
                  </button>
                </li>
              )
            )}
          </ul>
        )}
        <input
          type="text"
          placeholder="Add tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInputKeyDown}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleImageChange}
        required
      />
      <button type="submit">
        <span>Add Post</span>
        <ChatCircleIcon size={24} />
      </button>
    </form>
  );
}

export default NewPostForm;
