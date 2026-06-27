import { useState, useEffect } from "react";
import Header from "./components/Header";
import NewPostForm from "./components/NewPostForm";
import Posts from "./components/Posts";
import Authentication from "./components/Authentication";
import { getToken, removeToken } from "./token";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = getToken();

    if (token) {
      try {
        // JWTs have three Base64-encoded parts separated by dots; the middle one is the payload
        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));

        // JWT exp is in seconds, Date.now() returns milliseconds
        const isExpired = Date.now() >= payload.exp * 1000;

        if (isExpired) {
          removeToken();
          return;
        }

        setLoggedInUser({ username: payload.username });
      } catch (err) {
        // Token is malformed — discard it
        removeToken();
      }
    }
  }, []);

  return (
    <div id="app-content">
      <Header loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      {loggedInUser ? (
        <main>
          <h2>Add Post</h2>
          <NewPostForm setPosts={setPosts} />
          <h2>Latest Posts</h2>
          <Posts setPosts={setPosts} posts={posts} loggedInUser={loggedInUser} />
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
