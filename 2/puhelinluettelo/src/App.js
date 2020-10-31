import React, { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import PersonServices from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [statusMessage, setStatusMessage] = useState({ message: null, isError: false });

  const nameChange = (event) => {
    setNewName(event.target.value);
  };

  const numberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const filterChange = (event) => {
    setFilter(event.target.value);
  };

  const showStatusMessage = (message, isError) => {
    setStatusMessage({ message, isError });
    setTimeout(() => {
      setStatusMessage({ message: null, isError: false });
    }, 3000);
  };

  const addName = (event) => {
    event.preventDefault();
    if (
      newName === "" ||
      newNumber === "" ||
      !newNumber.replaceAll("-", "").match(/^\d+$/) ||
      newNumber.indexOf("-") === 0 ||
      newNumber.indexOf("-") === newNumber.length - 1
    ) {
      showStatusMessage("Check details", true);
      return;
    }

    if (persons.some((person) => person.name.toLowerCase() === newName.toLowerCase())) {
      const targetPerson = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());
      if (targetPerson.number === newNumber) {
        showStatusMessage("Check Old number is same as new number", true);
        return;
      }
      if (window.confirm(`${targetPerson.name} is already added to phonebook, replace old number with new one?`)) {
        PersonServices.updatePerson(targetPerson.id, { ...targetPerson, number: newNumber })
          .then((updatedPerson) => {
            setPersons(persons.map((person) => (person.id === targetPerson.id ? updatedPerson : person)));
            setNewName("");
            setNewNumber("");
            showStatusMessage(`${targetPerson.name}'s phonenumber was updated successfully`, false);
          })
          .catch((error) => showStatusMessage(`Unable to update ${targetPerson.name}'s phonenumber`, true));
      }
    } else {
      PersonServices.addPerson({ name: newName, number: newNumber })
        .then((addedPerson) => {
          setPersons(persons.concat(addedPerson));
          setNewName("");
          setNewNumber("");
          showStatusMessage(`${newName} added`, false);
        })
        .catch((error) => showStatusMessage(`Unable to add ${newName}`, true));
    }
  };

  const deleteName = (id, name) => {
    if (window.confirm(`Do you want to delete ${name}?`)) {
      PersonServices.deletePerson(id)
        .then((data) => {
          setPersons(persons.filter((person) => person.id !== id));
          showStatusMessage(`${name} deleted`, false);
        })
        .catch((error) => {
          console.log(error);
          showStatusMessage(`Unable to delete ${name}`, true);
        });
    }
  };

  useEffect(() => {
    PersonServices.getPersons()
      .then((data) => {
        setPersons(data);
      })
      .catch((error) => showStatusMessage("Unable to get phonebook data", true));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={filterChange}></Filter>
      <h2>Add new</h2>
      <PersonForm formProps={{ nameChange, numberChange, addName, newName, newNumber }}></PersonForm>
      <h2>Numbers</h2>
      <PersonList filter={filter} persons={persons} deleteName={deleteName}></PersonList>
      <Notification data={statusMessage}></Notification>
    </div>
  );
};

export default App;
