import { TrashIcon } from "@phosphor-icons/react";
import { convertUnixToTimestamp } from "../helper";

function Posts({posts, loggedInUser}) {
  return (
    <div id="posts">
      {posts.map((post) => {
        return (
          <div key={post.id} className="post">
            <div className="post-header">
              <div className="post-author">
                <div className="post-author-name">{post.author.name}</div>
                <div className="post-author-username gradient-text">@{post.author.username}</div>
              </div>
              {/* only visible to the author */}
              {loggedInUser.username === post.author.username && (
                <div className="post-delete-button">
                  <span>Delete</span>
                  <TrashIcon size={24} />
                </div>
              )}
            </div>
            <img className="post-image" src={post.imageUrl} alt="Post Thumbnail" />
            <div className="post-footer">
              <h3 className="post-title">{post.title}</h3>
              <span className="post-timestamp">({convertUnixToTimestamp(post.postedAt)})</span>
              <p className="post-description">{post.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Posts;
