import React, { useRef } from "react";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import Blog from "./Blog";
import { toggleSortingAction } from "../reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";

import styled from "styled-components";

const StyledBlog = styled.div`
  margin: 2em;
  display: block;
`;

const BlogLink = styled(Link)`
  border: 0.25em solid #123;
  border-radius: 0.5em;
  padding: 0.25em;
  background: linear-gradient(60deg, rgba(54, 54, 54, 1) 0%, rgba(112, 112, 112, 1) 100%);
  color: #fff;
`;

const BlogSortButton = styled.button`
  display: inline-block;
  margin: 0 2em;
  padding: 0.25em 2em;
`;

const MainHeader = styled.h2`
  display: inline-block;
`;

const Blogs = () => {
  const dispatch = useDispatch();
  const userData = useSelector(({ user }) => user.userdata);

  const blogs = useSelector(({ blog }) => blog.blogs);
  const sorting = useSelector(({ blog }) => blog.sorting);
  const blogFormRef = useRef();

  const getBlogIdFromRoute = useRouteMatch("/blogs/:id");
  const blog = getBlogIdFromRoute ? blogs.find((blog) => blog.id === getBlogIdFromRoute.params.id) : null;

  if (!blogs) {
    return null;
  }

  return (
    <div>
      <MainHeader>blogs</MainHeader>
      <BlogSortButton onClick={() => dispatch(toggleSortingAction(!sorting))}>
        {sorting !== null ? (sorting === true ? "Sorting by likes ASC " : "sorting by likes DESC") : "Sort by likes"}
      </BlogSortButton>
      <Switch>
        <Route path="/blogs/:id">
          <Blog blog={blog} user={userData.username}></Blog>
        </Route>
        <Route path="/">
          <Togglable buttonName="Create new blog" ref={blogFormRef}>
            <BlogForm></BlogForm>
          </Togglable>
          {blogs.map((blog) => (
            <StyledBlog key={blog.id}>
              <BlogLink to={`/blogs/${blog.id}`}>{`${blog.title} ${blog.author}`}</BlogLink>
            </StyledBlog>
          ))}
        </Route>
      </Switch>
    </div>
  );
};

export default Blogs;
