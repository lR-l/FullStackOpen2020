import axios from "axios";
const baseUrl = "/api/login";

const login = async (username, password) => {
  const request = await axios.post(baseUrl, { user: username, pwd: password });
  return request.data;
};

const loginService = { login };

export default loginService;
