import { useEffect } from "react";
import { loadPosts, deletePost } from "../api";
import Post from "./Post";

function Posts({ setPosts, posts, loggedInUser }) {
  useEffect(() => {
    loadPosts(setPosts);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Do you really want to delete this post?")) {
      deletePost(id, setPosts);
    }
  };

  return (
    <ul id="posts">
      {posts.length === 0 ? (
        <li id="no-posts-hint">
          <p>No posts available.</p>
        </li>
      ) : (
        posts.map((post) => (
          <li key={post._id}>
            <Post post={post} loggedInUser={loggedInUser} onDelete={handleDelete} />
          </li>
        ))
      )}
    </ul>
  );
}

export default Posts;
