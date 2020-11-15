import anecdoteService from "../services/anecdotes";

const sortingByVotes = (anecdotes) => {
  return anecdotes.sort((a, b) => {
    if (a.votes > b.votes) {
      return -1;
    }
    if (a.votes < b.votes) {
      return 1;
    }
    return 0;
  });
};

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case "VOTE":
      return sortingByVotes(state.map((anecdote) => (anecdote.id !== action.data.anecdote.id ? anecdote : action.data.anecdote)));

    case "CREATE_ANECDOTE":
      return sortingByVotes(state.concat(action.data.anecdote));

    case "INIT_ANECDOTES":
      return sortingByVotes(action.data.anecdotes);
    default:
      return state;
  }
};

export const voteAction = ({ id, content, votes }) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.updateVotes(id, content, votes + 1);

    dispatch({
      type: "VOTE",
      data: { anecdote: updatedAnecdote },
    });
  };
};

export const createAnecdoteAction = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);

    dispatch({
      type: "CREATE_ANECDOTE",
      data: { anecdote: newAnecdote },
    });
  };
};

export const setInitialAnecdotesAction = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: "INIT_ANECDOTES",
      data: { anecdotes },
    });
  };
};

export default anecdoteReducer;
