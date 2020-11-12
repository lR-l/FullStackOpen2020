import React, { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, like, deleteBlog, user }) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const styles = {
    blog: {
      paddingTop: 10,
      paddingLeft: 2,
      border: "solid",
      borderWidth: 1,
      marginBottom: 5,
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
  };

  const renderDeleteButton = () => {
    if (user === blog.user.username) {
      return (
        <div>
          <button
            style={{ ...styles.button, ...styles.deleteButton }}
            onClick={() => {
              deleteBlog(blog.id, blog.title);
            }}
          >
            Delete
          </button>
        </div>
      );
    }
    return null;
  };

  if (showAll) {
    return (
      <div style={styles.blog}>
        <div>
          <span style={styles.title} onClick={toggleShowAll} className="blogTitle">
            {blog.title} {blog.author}
          </span>
          <button style={styles.button} onClick={toggleShowAll}>
            Hide
          </button>
        </div>
        <div>
          <span>{blog.author}</span>
        </div>
        <div>
          <span>{blog.url}</span>
        </div>
        <div>
          <span>Likes: {blog.likes}</span>
          <button style={styles.button} onClick={() => like(blog.id, blog.likes + 1)}>
            Like 👍
          </button>
        </div>
        <div>
          <span>{blog.user.name}</span>
        </div>
        {renderDeleteButton()}
      </div>
    );
  } else {
    return (
      <div style={styles.blog} className="blogTitle">
        <span style={styles.title} onClick={toggleShowAll}>
          {blog.title} {blog.author}
        </span>
        <button style={styles.button} onClick={toggleShowAll}>
          Show
        </button>
      </div>
    );
  }
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
};

export default Blog;
