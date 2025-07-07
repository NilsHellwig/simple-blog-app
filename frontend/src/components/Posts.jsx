import { TrashIcon } from "@phosphor-icons/react";
import { convertUnixToTimestamp } from "../helper";
import { loadPosts, deletePost } from "../api";
import { BACKEND_URL } from "../const";

function Posts() {
  const canDeletePost = (post) => {
    return loggedInUser.username === post.author.username;
  };

  const handleDelete = (id) => {
    console.log(id);
  };
  return (
    <div id="posts">
      {postMessage.length === 0 && <div>No posts available</div>}
      {posts.map((post) => {
        return (
          <div key={post._id} className="post">
            <div className="post-header">
              <div className="post-author">
                <div className="post-author-name">{post.author.name}</div>
                <div className="post-author-username gradient-text">{post.author.username}</div>
              </div>
              {canDeletePost(post) && (
                <div className="post-delete-button" onClick={() => handleDelete(post._id)}>
                  <span>Delete</span>
                  <TrashIcon size={24} />
                </div>
              )}
            </div>
            <img className="post-image" src={`${BACKEND_URL}/images/${post.imageUrl}`} alt="Post Image" />

          </div>
        );
      })}
    </div>
  );
}

export default Posts;
