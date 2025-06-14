import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";

function NewPostForm(posts, setPosts) {
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    imageBase64: "",
  });

  const addNewPost = (e) => {
    const newPostData = {
      id: posts.length + 1,
      title: newPost.title,
      description: newPost.description,
      imageBase64: newPost.imageBase64,
    };

    if (!newPostData.title || !newPostData.description || !newPostData.imageBase64) {
      alert("Please fill in all fields.");
      return;
    }
    setPosts([...posts, newPostData]);
    setNewPost({ title: "", description: "", imageBase64: "" });
  };

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
        e.preventDefault();
        addNewPost(e);
      }}
    >
      <input type="text" placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} required />
      <textarea placeholder="Description" value={newPost.description} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} required></textarea>
      <input
        id="add-post-form-image"
        type="file"
        accept="image/*"
        onChange={(e) => {
          uploadImage(e);
        }}
      />
      <button type="submit">
        <span>Add Post</span>
        <PlusIcon size={24} />
      </button>
    </form>
  );
}

export default NewPostForm;
