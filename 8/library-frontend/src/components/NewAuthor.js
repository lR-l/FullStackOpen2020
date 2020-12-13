import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { ALL_AUTHORS } from "./Authors";

const NEW_AUTHOR = gql`
  mutation newAuthor($name: String!, $born: Int) {
    addAuthor(name: $name, born: $born) {
      id
    }
  }
`;

const NewAuthor = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [newAuthor] = useMutation(NEW_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      //console.log(error);
      props.errorCallback(error.message);
    },
    onCompleted: (data) => {
      setName("");
      setBorn("");
    },
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    newAuthor({
      variables: { name, born: Number(born) },
    });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <input value={name} onChange={({ target }) => setName(target.value)} />
        </div>
        <div>
          born
          <input type="number" value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type="submit">create author</button>
      </form>
    </div>
  );
};

export default NewAuthor;
