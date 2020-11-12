import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (title, author, url, userToken) => {
  const token = `bearer ${userToken}`;
  const config = {
    headers: { Authorization: token },
  };
  const request = await axios.post(baseUrl, { title, author, url }, config);
  return request.data;
};

const like = async (id, likes, userToken) => {
  const token = `bearer ${userToken}`;
  const config = {
    headers: { Authorization: token },
  };
  const request = await axios.put(`${baseUrl}/${id}`, { likes }, config);
  return request.data;
};

const deleteEntry = async (id, userToken) => {
  const token = `bearer ${userToken}`;
  const config = {
    headers: { Authorization: token },
  };
  const request = await axios.delete(`${baseUrl}/${id}`, config);
  return request.data;
};

const blogService = {
  getAll,
  create,
  like,
  deleteEntry,
};

export default blogService;
