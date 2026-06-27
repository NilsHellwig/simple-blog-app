import { ChatCircleIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { addNewPost } from "../api";

function NewPostForm({ setPosts }) {
  const fileInputRef = useRef();
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    imageBase64: "",
  });

  const updateNewPost = (key, value) => {
    setNewPost((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewPost(newPost, setPosts, setNewPost, fileInputRef);
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
      <textarea
        placeholder="Description"
        value={newPost.description}
        onChange={(e) => updateNewPost("description", e.target.value)}
        required
      />
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
