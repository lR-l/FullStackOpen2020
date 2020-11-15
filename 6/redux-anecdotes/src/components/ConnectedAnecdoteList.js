import React from "react";
import { connect } from "react-redux";
import { voteAction } from "../reducers/anecdoteReducer";
import { setNotificationAction } from "../reducers/notificationReducer";

const AnecdoteList = (props) => {
  const vote = (anecdote) => {
    props.voteAction(anecdote);
    props.setNotificationAction(`You voted '${anecdote.content}'`, 5);
  };

  return (
    <>
      {props.anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    anecdotes:
      state.filter === "" ? state.anecdotes : state.anecdotes.filter((anecdote) => anecdote.content.toLowerCase().indexOf(state.filter.toLowerCase()) !== -1),
  };
};

const mapDispatchToProps = {
  voteAction,
  setNotificationAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList);
