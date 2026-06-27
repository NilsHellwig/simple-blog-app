import { BACKEND_URL } from "./const";
import { getToken, setToken } from "./token";

const authenticate = async (endpoint, body, setLoggedInUser) => {
  try {
    const res = await fetch(`${BACKEND_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "An error occurred");
      return;
    }

    setToken(data.token);
    setLoggedInUser(data.user);
  } catch (err) {
    console.error("Server error:", err);
  }
};

export const login = (username, password, setLoggedInUser) =>
  authenticate("login", { username, password }, setLoggedInUser);

export const register = (username, password, fullName, setLoggedInUser) =>
  authenticate("register", { username, password, name: fullName }, setLoggedInUser);

export const addNewPost = async (newPost, setPosts, setNewPost, fileInputRef) => {
  if (!newPost.title || !newPost.description || !newPost.imageBase64) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        title: newPost.title,
        description: newPost.description,
        imageBase64: newPost.imageBase64,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to create post.");
    }

    const updatedPosts = await response.json();
    setPosts(updatedPosts);
    setNewPost({ title: "", description: "", imageBase64: "" });
    fileInputRef.current.value = "";
  } catch (err) {
    alert("Error: " + err.message);
  }
};

export const loadPosts = async (setPosts) => {
  try {
    const res = await fetch(`${BACKEND_URL}/posts`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    setPosts(data);
  } catch (err) {
    console.error("Error loading posts:", err);
  }
};

export const deletePost = async (id, setPosts) => {
  try {
    const res = await fetch(`${BACKEND_URL}/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!res.ok) throw new Error("Delete failed");

    const updatedPosts = await res.json();
    setPosts(updatedPosts);
  } catch (err) {
    console.error("Error deleting post:", err);
  }
};
