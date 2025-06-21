import { ChatCircleIcon } from "@phosphor-icons/react";
import { useState } from "react";

function NewPostForm({ posts, setPosts }) {
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    imageBase64: "",
  });

  const updateNewPost = (key, value) => {
    setNewPost({ ...newPost, [key]: value });
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateNewPost("imageBase64", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      id="add-post-form"
      onSubmit={(e) => {
        
      }}
    >
      <input type="text" placeholder="Title" value={newPost.title} onChange={(e) => updateNewPost("title", e.target.value)} required />
      <textarea placeholder="Description" value={newPost.description} onChange={(e) => updateNewPost("description", e.target.value)} required />
      <input ref={fileInputRef} id="add-post-form-image" type="file" accept="image/jpeg,image/png" onChange={uploadImage} required />
      <button type="submit">
        <span>Add Post</span>
        <ChatCircleIcon size={24} />
      </button>
    </form>
  );
}

export default NewPostForm;
