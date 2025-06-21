import { TrashIcon } from "@phosphor-icons/react";
import { convertUnixToTimestamp } from "../helper";
import { BACKEND_URL } from "../const";

function Posts({ setPosts, posts, loggedInUser }) {
  const handleDelete = (id) => {

  };

  const canDeletePost = (post) => loggedInUser?.username === post.author.username;

  return (
    <div id="posts">
      {posts.length === 0 ? (
        <div id="no-posts-hint">
          <p>No posts available.</p>
        </div>
      ) : (
        posts.map((post) => {
          return (
            <div key={post._id} className="post">
              <div className="post-header">
                <div className="post-author">
                  <div className="post-author-name">{post.author.name}</div>
                  <div className="post-author-username gradient-text">@{post.author.username}</div>
                </div>
                {canDeletePost(post) && (
                  <div className="post-delete-button" onClick={() => {}}>
                    <span>Delete</span>
                    <TrashIcon size={24} />
                  </div>
                )}
              </div>
              <img className="post-image" src={`${BACKEND_URL}/images/${post.imageUrl}.png`} alt="Post Thumbnail" />
              <div className="post-footer">
                <h3 className="post-title">{post.title}</h3>
                <span className="post-timestamp">({convertUnixToTimestamp(post.postedAt)})</span>
                <p className="post-description">{post.description}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Posts;
