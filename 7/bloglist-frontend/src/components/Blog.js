import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { likeBlogAction, deleteBlogAction, addCommentToBlogAction } from "../reducers/blogReducer";

const styles = {
  blog: {
    paddingTop: "2em",
    paddingLeft: "1em",
    border: "solid",
    borderWidth: "0.2em",
    marginBottom: "1em",
    width: "25vw",
  },
  button: {
    marginLeft: "1em",
    verticalAlign: "middle",
    marginBottom: "0.5em",
  },
  okButton: {
    backgroundColor: "#538a01",
  },
  deleteButton: {
    backgroundColor: "#f5776e",
  },
  title: {
    fontWeight: "bold",
    cursor: "pointer",
  },
  commentList: {
    listStyleType: "none",
  },
  commentHeader: {
    display: "block",
    marginTop: "2em",
    fontWeight: "bold",
  },
  commentForm: {
    padding: "1em",
    marginTop: "1em",
  },
  commentField: {
    marginRight: "1em",
  },
};

const Blog = ({ blog, user }) => {
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();

  const sendComment = (event) => {
    event.preventDefault();
    dispatch(addCommentToBlogAction(blog.id, commentText));
    setCommentText("");
  };

  if (!blog) {
    return null;
  }

  const renderDeleteButton = () => {
    if (user === blog.user.username) {
      return (
        <div>
          <button
            style={{ ...styles.button, ...styles.deleteButton }}
            onClick={() => {
              dispatch(deleteBlogAction(blog.id, blog.title));
            }}
          >
            Delete
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.blog}>
      <div>
        <span style={styles.title} className="blogTitle">
          {blog.title} {blog.author}
        </span>
      </div>
      <div>
        <span>{blog.author}</span>
      </div>
      <div>
        <span>{blog.url}</span>
      </div>
      <div>
        <span>Likes: {blog.likes}</span>
        <button style={styles.button} onClick={() => dispatch(likeBlogAction(blog.id, blog.likes + 1))}>
          Like 👍
        </button>
      </div>
      <div>
        <span>added by {blog.user.name}</span>
      </div>
      <div>
        <span style={styles.commentHeader}>comments</span>
        <ul style={styles.commentList}>
          {blog.comments.map((comment) => (
            <li key={comment.id}>{comment.text}</li>
          ))}
        </ul>
        <form style={styles.commentForm} onSubmit={sendComment}>
          <input
            value={commentText}
            onChange={({ target }) => {
              setCommentText(target.value);
            }}
            style={styles.commentField}
          ></input>
          <button type="submit">add comment</button>
        </form>
      </div>
      {renderDeleteButton()}
    </div>
  );
};

export default Blog;
