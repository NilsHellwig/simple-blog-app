import { BACKEND_URL } from "./const";

export const handleAuthentication = async (e, loginMode, setLoggedInUser, username, password, fullName) => {
  e.preventDefault();

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

