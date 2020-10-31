import axios from "axios";

const url = "http://localhost:3001/persons";

const getPersons = () => {
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      alert("Error getting data");
    });
};

const addPerson = (person) => {
  return axios.post(url, person).then((response) => response.data);
};

const updatePerson = (id, person) => {
  return axios.put(`${url}/${id}`, person).then((response) => response.data);
};

const deletePerson = (id) => {
  return axios.delete(`${url}/${id}`).then((response) => response.status);
};

const personServices = {
  getPersons,
  addPerson,
  deletePerson,
  updatePerson,
};

export default personServices;
