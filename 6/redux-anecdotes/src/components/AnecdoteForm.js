import React from "react";
import { useDispatch } from "react-redux";
import { createAnecdoteAction } from "../reducers/anecdoteReducer";
import { setNotificationAction } from "../reducers/notificationReducer";
const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const createAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.content.value;
    if (content !== "") {
      e.target.content.value = "";
      dispatch(createAnecdoteAction(content));
      dispatch(setNotificationAction(`Created new anecdote: '${content}'`, 5));
    }
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={createAnecdote}>
        <div>
          <input name="content" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
