import { FRONTEND_URL } from "./const";

export const handleSubmit = async (e, loginMode, setLoggedInUser, username, password, fullName) => {
  e.preventDefault();

  const url = `${FRONTEND_URL}/${loginMode ? "login" : "register"}`;

  const body = loginMode ? { username, password } : { username, password, name: fullName };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Ein Fehler ist aufgetreten");
      return;
    }

    if (loginMode) {
      localStorage.setItem("token", data.token);
      setLoggedInUser(data.user);
    } else {
      alert("Registrierung erfolgreich. Jetzt einloggen!");
    }
  } catch (err) {
    console.error(err);
    alert("Serverfehler");
  }
};

export const addNewPost = async (e, newPost, setPosts, setNewPost) => {
  e.preventDefault();

  if (!newPost.title || !newPost.description || !newPost.imageBase64) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${FRONTEND_URL}/posts`, {
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
  } catch (err) {
    alert("Error: " + err.message);
  }
};

export const loadPosts = async (setPosts) => {
  const token = localStorage.getItem("token");
  fetch(`${FRONTEND_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setPosts(data))
    .catch((err) => console.error("Fehler beim Laden der Posts:", err));
};

// api.js
export async function deletePost(id, setPosts) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${FRONTEND_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Löschen fehlgeschlagen");

    // Neue Liste vom Server holen
    const updatedPosts = await res.json();
    setPosts(updatedPosts);
  } catch (err) {
    console.error("Fehler beim Löschen des Beitrags:", err);
  }
}
