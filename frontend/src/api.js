import { BACKEND_URL } from "./const"

export const loadPosts = async (setPosts) => {
  const token = localStorage.getItem("token");
  fetch(`${BACKEND_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setPosts(data))
    .catch((err) => console.error("Error loading posts:", err));
};


export const handleAuthentication = async (e, loginMode, setLoggedInUser, username, password, fullName) => {
  const url = `${BACKEND_URL}/${loginMode ? "login" : "register"}`;

  const body = loginMode ? { username, password } : { username, password, name: fullName };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "An error occurred");
      return;
    }

    localStorage.setItem("token", data.token);
    setLoggedInUser(data.user);
  } catch (err) {
    console.error("Server error:", err);
  }
};

export const addNewPost = async (e, newPost, setPosts, setNewPost, fileInputRef) => {
  e.preventDefault();

  if (!newPost.title || !newPost.description || !newPost.imageBase64) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BACKEND_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newPost.title,
        description: newPost.description,
        imageUrl: newPost.imageBase64,
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