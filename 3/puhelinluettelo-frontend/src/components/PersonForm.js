import React from "react";

const PersonForm = ({ formProps: { addName, nameChange, numberChange, newName, newNumber } }) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={nameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={numberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
