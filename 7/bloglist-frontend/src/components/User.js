import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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

const UserText = styled.span`
  display: block;
  font-weight: bold;
  margin-bottom: 1em;
`;

const LinkContainer = styled.div`
  margin: 1em;
`;

const User = ({ user }) => {
  if (!user) {
    return null;
  }

  const userBlogs = user.blogs.map((blog) => (
    <div key={blog.id}>
      <Link to={`/blogs/${blog.id}`}>{`${blog.title} ${blog.author}`}</Link>
    </div>
  ));

  return (
    <div style={styles.blog}>
      <UserText>{user.name}</UserText>
      <LinkContainer>{user.blogs.length > 0 ? userBlogs : "No blogs"}</LinkContainer>
    </div>
  );
};

export default User;
