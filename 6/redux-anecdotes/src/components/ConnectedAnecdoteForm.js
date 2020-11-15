import React from "react";
import { connect } from "react-redux";
import { createAnecdoteAction } from "../reducers/anecdoteReducer";
import { setNotificationAction } from "../reducers/notificationReducer";
const AnecdoteForm = (props) => {
  const createAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.content.value;
    if (content !== "") {
      e.target.content.value = "";
      props.createAnecdoteAction(content);
      props.setNotificationAction(`Created new anecdote: '${content}'`, 5);
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

const mapDispatchToProps = {
  createAnecdoteAction,
  setNotificationAction,
};

export default connect(null, mapDispatchToProps)(AnecdoteForm);
