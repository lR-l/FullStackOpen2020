import axios from "axios";
const baseUrl = "http://localhost:3001/anecdotes";

const getId = () => (100000 * Math.random()).toFixed(0);

const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

const createNew = async (content) => {
  const res = await axios.post(baseUrl, { id: getId(), content, votes: 0 });
  return res.data;
};

const updateVotes = async (id, content, votes) => {
  const res = await axios.put(`${baseUrl}/${id}`, { id, content, votes });
  return res.data;
};

const anecdoteSerivce = {
  getAll,
  createNew,
  updateVotes,
};

export default anecdoteSerivce;
