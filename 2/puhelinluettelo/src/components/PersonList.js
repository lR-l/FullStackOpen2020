import React from "react";
import "./PersonListStyle.css";
import "../services/persons";

const PersonList = ({ filter, persons, deleteName }) => {
  const personList = filter
    ? persons.filter((person) => {
        return person.name.toLowerCase().includes(filter);
      })
    : persons;

  return personList.length > 0 ? (
    personList.map((person) => (
      <div key={person.name} className="personDetails">
        <span className="personName">{person.name}</span>
        <span className="personNumber">{person.number}</span>
        <div className="buttonContainer">
          <button onClick={() => deleteName(person.id, person.name)}>Delete</button>
        </div>
      </div>
    ))
  ) : filter ? (
    <p>No results</p>
  ) : (
    <p>Your phonebook is empty</p>
  );
};

export default PersonList;
