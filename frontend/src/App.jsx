import { useState } from "react";

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

  const [loggedInUser, setLoggedInUser] = useState(loggedInUserDummy);
  const [posts, setPosts] = useState(postsDummy);

  return (
    <div id="app-content">
      <Header loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser } />
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
