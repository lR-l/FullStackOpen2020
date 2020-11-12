import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./App.css";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const [sorting, setSorting] = useState(null);

  const blogFormRef = useRef();

  const login = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login(username, password);
      setUser(user);
      window.localStorage.setItem("userToken", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (err) {
      console.log("Error:", err);
      setStatusMessage({ msg: "Wrong credentails", err: true });
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("userToken");
    setStatusMessage({ msg: "Logged out", err: false });
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  };

  const createBlog = async (title, author, url) => {
    blogFormRef.current.toggleVisibility();
    try {
      const blog = await blogService.create(title, author, url, user.token);
      setBlogs(blogs.concat(blog));
      setStatusMessage({ msg: `Blog created successfully! (${title})`, err: false });
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    } catch (err) {
      console.log("Error:", err);
      setStatusMessage({ msg: "Unable to create blog", err: true });
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    }
  };

  const likeBlog = async (id, likes) => {
    try {
      const UpdatedBlog = await blogService.like(id, likes, user.token);
      console.log(UpdatedBlog);

      setBlogs(blogs.map((blog) => (blog.id === UpdatedBlog.id ? UpdatedBlog : blog)));
      setStatusMessage({ msg: `Updated "${UpdatedBlog.title}" likes`, err: false });
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    } catch (err) {
      console.log("Error:", err);
      setStatusMessage({ msg: "Unable to update blog likes", err: true });
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    }
  };

  const deleteBlog = async (id, title) => {
    if (window.confirm(`Do you want to delete "${title}" blog`)) {
      try {
        await blogService.deleteEntry(id, user.token);
        setBlogs(blogs.filter((blog) => blog.id !== id));
        setStatusMessage({ msg: `Deleted blog "${title}"`, err: false });
        setTimeout(() => {
          setStatusMessage(null);
        }, 5000);
      } catch (err) {
        console.log("Error:", err);
        setStatusMessage({ msg: "Unable to delete blog", err: true });
        setTimeout(() => {
          setStatusMessage(null);
        }, 5000);
      }
    }
  };

  const toggleSort = () => {
    setSorting(!sorting);
  };

  const getBlogs = () => {
    if (sorting === null) {
      return blogs;
    }

    return blogs.sort((a, b) => {
      if (a.likes > b.likes) {
        return sorting ? 1 : -1;
      }
      if (a.likes < b.likes) {
        return sorting ? -1 : 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const userLogged = window.localStorage.getItem("userToken");
    if (userLogged) {
      const user = JSON.parse(userLogged);
      setUser(user);
    }
  }, []);

  if (user === null) {
    return (
      <LoginForm
        statusMessage={statusMessage}
        onSubmit={login}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      ></LoginForm>
    );
  } else {
    return (
      <div>
        <h2>blogs</h2>
        {statusMessage ? (
          <div className={statusMessage.err ? "errorMessage" : "infoMessage"}>
            <span>{statusMessage.msg}</span>
          </div>
        ) : null}
        <span className="welcomeText">{user.name} logged in</span>
        <button className="logoutButton" onClick={logout}>
          Logout
        </button>
        <Togglable buttonName="Create new form" ref={blogFormRef}>
          <BlogForm createBlog={createBlog}></BlogForm>
        </Togglable>
        <button className="sortButton" onClick={toggleSort}>
          {sorting !== null ? (sorting === true ? "Sorting by likes ASC " : "sorting by likes DESC") : "Sort by likes"}
        </button>
        {getBlogs().map((blog) => (
          <Blog key={blog.id} blog={blog} like={likeBlog} deleteBlog={deleteBlog} user={user.username} />
        ))}
      </div>
    );
  }
};

export default App;
