import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTitleAction, setAuthorAction, setUrlAction, createBlogAction } from "../reducers/blogReducer";
import styled from "styled-components";

const FormRowContainer = styled.div`
  display: flex;
  margin: 0.5em 0em;
`;

const FormRowContainerText = styled.span`
  flex: 1;
  margin-right: 1em;
`;

const ButtonContainer = styled.div`
  text-align: right;
`;

const OkButton = styled.button`
  display: inline-block;
  background-color: #4d974d;
  color: white;
  padding: 0.25em 2em;
  font-weight: bold;
  border: 0.25em solid #123;
  border-radius: 1em;
  margin-top: 1em;
`;

const BlogForm = () => {
  const dispatch = useDispatch();

  const title = useSelector(({ blog }) => blog.title);
  const author = useSelector(({ blog }) => blog.author);
  const url = useSelector(({ blog }) => blog.url);

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(createBlogAction(title, author, url));
  };

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={onSubmit}>
        <FormRowContainer>
          <FormRowContainerText>Title:</FormRowContainerText>
          <input
            id="title"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => {
              dispatch(setTitleAction(target.value));
            }}
          ></input>
        </FormRowContainer>
        <FormRowContainer>
          <FormRowContainerText>Author:</FormRowContainerText>
          <input
            id="author"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => {
              dispatch(setAuthorAction(target.value));
            }}
          ></input>
        </FormRowContainer>
        <FormRowContainer>
          <FormRowContainerText>Url:</FormRowContainerText>
          <input
            id="url"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => {
              dispatch(setUrlAction(target.value));
            }}
          ></input>
        </FormRowContainer>
        <ButtonContainer>
          <OkButton type="submit">Ok</OkButton>
        </ButtonContainer>
      </form>
    </div>
  );
};

export default BlogForm;
