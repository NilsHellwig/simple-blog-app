import { useState } from "react";
import "./index.css";
import Header from "./components/Header";
import NewPostForm from "./components/NewPostForm";
import Posts from "./components/Posts";
import Authentication from "./components/Authentication";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(undefined);
  const [posts, setPosts] = useState([]);


  return (
    <div id="app-content">
      <Header loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      {loggedInUser ? (
        <main>
          <h2>Add Post</h2>
          <NewPostForm posts={posts} setPosts={setPosts} />
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
