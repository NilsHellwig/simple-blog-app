import { TrashIcon } from "@phosphor-icons/react";
import { convertUnixToTimestamp } from "../helper";
import { BACKEND_URL } from "../const";

function Post({ post, loggedInUser, onDelete }) {
  const canDelete = loggedInUser?.username === post.author.username;

  return (
    <article className="post">
      <div className="post-header">
        <div className="post-author">
          <div className="post-author-username gradient-text">@{post.author.username}</div>
        </div>
        {canDelete && (
          <button className="post-delete-button" type="button" onClick={() => onDelete(post._id)}>
            <span>Delete</span>
            <TrashIcon size={24} />
          </button>
        )}
      </div>
      <img
        className="post-image"
        src={`${BACKEND_URL}/images/${post._id}.png`}
        alt="Post Thumbnail"
      />
      <div className="post-body">
        <h3 className="post-title">{post.title}</h3>
        <span className="post-timestamp">({convertUnixToTimestamp(post.postedAt)})</span>
        <p className="post-description">{post.description}</p>
      </div>
    </article>
  );
}

export default Post;
