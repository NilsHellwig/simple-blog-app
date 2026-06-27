import { useEffect } from "react";
import { TrashIcon } from "@phosphor-icons/react";
import { convertUnixToTimestamp } from "../helper";
import { loadPosts, deletePost } from "../api";
import { BACKEND_URL } from "../const";

function Posts({ setPosts, posts, loggedInUser }) {
  useEffect(() => {
    loadPosts(setPosts);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Do you really want to delete this post?")) {
      deletePost(id, setPosts);
    }
  };

  const canDeletePost = (post) => loggedInUser?.username === post.author.username;

  return (
    <ul id="posts">
      {posts.length === 0 ? (
        <li id="no-posts-hint">
          <p>No posts available.</p>
        </li>
      ) : (
        posts.map((post) => (
          <li key={post._id}>
            <article className="post">
              <header className="post-header">
                <div className="post-author">
                  <div className="post-author-name">{post.author.name}</div>
                  <div className="post-author-username gradient-text">@{post.author.username}</div>
                </div>
                {canDeletePost(post) && (
                  <button
                    className="post-delete-button"
                    type="button"
                    onClick={() => handleDelete(post._id)}
                  >
                    <span>Delete</span>
                    <TrashIcon size={24} />
                  </button>
                )}
              </header>
              <img
                className="post-image"
                src={`${BACKEND_URL}/images/${post.imageUrl}.png`}
                alt="Post Thumbnail"
              />
              <div className="post-footer">
                <h3 className="post-title">{post.title}</h3>
                <span className="post-timestamp">({convertUnixToTimestamp(post.postedAt)})</span>
                <p className="post-description">{post.description}</p>
              </div>
            </article>
          </li>
        ))
      )}
    </ul>
  );
}

export default Posts;
