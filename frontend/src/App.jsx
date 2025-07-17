import { useEffect, useState } from "react";

import Header from "./components/Header";
import NewPostForm from "./components/NewPostForm";
import Posts from "./components/Posts";
import Authentication from "./components/Authentication";

function App() {
  const loggedInUserDummy = {
    username: "john_doe",
    name: "John Doe",
  };

  const postsDummy = [
    {
      _id: 1,
      title: "First Post",
      description: "This is my first post",
      imageUrl: "post1",
      author: {
        username: "john_doe",
        name: "John Doe",
      },
    },
  ];

  const [loggedInUser, setLoggedInUser] = useState(undefined);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Hole das Token aus dem localStorage
    const token = localStorage.getItem("token");

    // Prüfe, ob ein Token vorhanden ist
    if (token) {
      try {
        // Extrahiere den Payload-Teil des JWT (zweiter Teil nach dem Punkt)
        const base64Payload = token.split(".")[1];

        // Dekodiere den Base64-Payload zu JSON
        const payload = JSON.parse(atob(base64Payload)); // atob steht für ASCII to Binary (historisch). Praktisch dekodiert sie einen Base64-codierten String zurück in einen normalen String.

        // Prüfe, ob das Token abgelaufen ist (Vergleich aktuelle Zeit mit exp * 1000)
        const isExpired = Date.now() >= payload.exp * 1000;

        // Wenn das Token abgelaufen ist, entferne es aus dem localStorage und beende
        if (isExpired) {
          localStorage.removeItem("token");
          return;
        }

        // Wenn das Token gültig ist, setze den eingeloggten Benutzer mit den Payload-Daten
        setLoggedInUser({
          id: payload.id, // Benutzer-ID aus Payload setzen
          username: payload.username, // Benutzername aus Payload setzen
          name: payload.name, // Name aus Payload setzen
        });
      } catch (err) {
        // Wenn ein Fehler auftritt (z.B. ungültiges Token), entferne es aus dem localStorage
        localStorage.removeItem("token");
      }
    }
  }, []); // Leeres Dependency-Array, damit dieser Effekt nur beim Initial-Render ausgeführt wird

  return (
    <div id="app-content">
      <Header loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      {loggedInUser ? (
        <main>
          <h2>Add Post</h2>
          <NewPostForm posts={posts} setPosts={setPosts} />
          <h2>Latest Posts</h2>
          <Posts posts={posts} setPosts={setPosts} loggedInUser={loggedInUser} />
        </main>
      ) : (
        <main>
          <h2>Welcome to Blogspace</h2>
          <p>Please log in to view and create posts.</p>
          <Authentication setLoggedInUser={setLoggedInUser} />
        </main>
      )}
    </div>
  );
}

export default App;
