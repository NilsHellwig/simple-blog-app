import { useState } from "react";
import "./index.css";
import { TrashIcon } from "@phosphor-icons/react";
import Header from "./components/Header";
import NewPostForm from "./components/NewPostForm";
import Posts from "./components/Posts";

function App() {
  const [loggedInUser, setLoggedInUser] = useState({
    username: "john_doe",
    name: "John Doe",
    email: "john_doe@mail.com",
  });

  // const [loggedInUser, setLoggedInUser] = useState(undefined);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "First Post",
      description: "This is the first post on your blog.",
      imageUrl: "https://placehold.co/700x600",
      author: {
        username: "john_doe",
        name: "John Doe",
      },
      postedAt: 1749891958,
    },
    {
      id: 2,
      title: "Second Post",
      description: "This is the second post on your blog.",
      imageUrl: "https://placehold.co/600x600",
      author: {
        username: "jane_doe",
        name: "Jane Doe",
      },
      postedAt: 1749891958,
    },
  ]);

  const [loginMode, setLoginMode] = useState(true);

  return (
    <div id="app-content">
      <Header loggedInUser={loggedInUser} />
      {loggedInUser ? (
        <main>
          <h2>Add Post</h2>
          <NewPostForm posts={posts} setPosts={setPosts} />
          <h2>Latest Posts</h2>
          <Posts posts={posts} loggedInUser={loggedInUser} />
        </main>
      ) : (
        <main>
          <h2>Welcome to Blogspace</h2>
          <p>Please log in to view and create posts.</p>
        </main>
      )}
    </div>
  );
}

export default App;
