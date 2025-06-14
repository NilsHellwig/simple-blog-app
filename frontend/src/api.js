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
