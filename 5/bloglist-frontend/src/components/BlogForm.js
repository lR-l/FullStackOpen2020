import React, { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    createBlog(title, author, url);
  };

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={onSubmit}>
        <div className="formRowContainer">
          <span className="formInputText">Title:</span>
          <input
            id="title"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => {
              setTitle(target.value);
            }}
          ></input>
        </div>
        <div className="formRowContainer">
          <span className="formInputText">Author:</span>
          <input
            id="author"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => {
              setAuthor(target.value);
            }}
          ></input>
        </div>
        <div className="formRowContainer">
          <span className="formInputText">Url:</span>
          <input
            id="url"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => {
              setUrl(target.value);
            }}
          ></input>
        </div>
        <button type="submit">Ok</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
