import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { addNewPost } from "../api";

function NewPostForm({ posts, setPosts }) {
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    imageBase64: "",
  });

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, imageBase64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      id="add-post-form"
      onSubmit={(e) => {
        addNewPost(e, newPost, setPosts, setNewPost);
      }}
    >
      <input type="text" placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} required />
      <textarea placeholder="Description" value={newPost.description} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} required />
      <input id="add-post-form-image" type="file" accept="image/jpeg,image/png" onChange={uploadImage} required />
      <button type="submit">
        <span>Add Post</span>
        <PlusIcon size={24} />
      </button>
    </form>
  );
}

export default NewPostForm;
