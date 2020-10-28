import React, { useState } from "react";
import ReactDOM from "react-dom";

const generateRandom = () => {
  return Math.floor(Math.random() * anecdotes.length);
};

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

const App = ({ anecdotes }) => {
  const [selected, setSelected] = useState(0);
  const [mostVoted, setMostVoted] = useState({ index: -1, count: -1 });
  const [votes, setVotes] = useState(Array.from(anecdotes, () => 0));
  const mostVotedAnecdote =
    mostVoted.count > -1 ? (
      <>
        <p>{anecdotes[mostVoted.index]}</p>
        <p>has {votes[mostVoted.index]} votes</p>
      </>
    ) : (
      <p>No votes casted</p>
    );

  const vote = () => {
    const newVotes = [...votes];
    newVotes[selected]++;

    if (newVotes[selected] >= mostVoted.count) {
      setMostVoted({ index: selected, count: newVotes[selected] });
    }
    setVotes(newVotes);
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button text="Vote" onClick={vote}></Button>
      <Button
        text="Next anecdote"
        onClick={() => {
          setSelected(generateRandom());
        }}
      ></Button>
      <h1>Anecdote with most votes</h1>
      {mostVotedAnecdote}
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
