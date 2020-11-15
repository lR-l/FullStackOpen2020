import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInitialAnecdotesAction } from "./reducers/anecdoteReducer";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import ConnectedAnecdoteList from "./components/ConnectedAnecdoteList";
import ConnectedAnecdoteForm from "./components/ConnectedAnecdoteForm";
import ConnectedFilter from "./components/ConnectedFilter";

const App = () => {
  const dispatch = useDispatch();
  const [useConnectedComponents, setUseConnectedComponents] = useState(false);

  useEffect(() => {
    dispatch(setInitialAnecdotesAction());
  }, [dispatch]);

  return (
    <div>
      <button
        onClick={() => {
          setUseConnectedComponents(!useConnectedComponents);
        }}
      >
        Toggle components
      </button>
      <span>{useConnectedComponents ? "Using connected components" : "Using non-connected components"}</span>
      <h2>Anecdotes</h2>
      <Notification></Notification>
      {useConnectedComponents ? (
        <>
          <ConnectedFilter></ConnectedFilter>
          <ConnectedAnecdoteList></ConnectedAnecdoteList>
          <ConnectedAnecdoteForm></ConnectedAnecdoteForm>
        </>
      ) : (
        <>
          <Filter></Filter>
          <AnecdoteList></AnecdoteList>
          <AnecdoteForm></AnecdoteForm>
        </>
      )}
    </div>
  );
};

export default App;
