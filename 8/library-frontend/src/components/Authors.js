import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Select from "react-select";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`;

const EDIT_BORN = gql`
  mutation editBorn($id: ID!, $born: Int!) {
    editAuthor(id: $id, setBornTo: $born) {
      id
      born
    }
  }
`;

const styles = {
  editAuthorContainer: {
    marginTop: "2em",
    border: "0.2em solid #123",
  },
};

const Authors = (props) => {
  const { loading, data } = useQuery(ALL_AUTHORS);
  const [editBorn, result] = useMutation(EDIT_BORN, {
    onError: (error) => {
      //console.log(error);
      props.errorCallback(error.message);
    },
    onCompleted: (data) => {
      setBirthYear("");
      setSelectedAuthor(null);
    },
  });
  const [authorOptions, setAuthorOptions] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [birthYear, setBirthYear] = useState("");

  useEffect(() => {
    if (data) {
      setAuthorOptions(
        data.allAuthors.map((author) => {
          return { value: author.id, label: author.name };
        })
      );
    }
    if (result && result.error) {
      props.errorCallback(result.error);
    }
  }, [data]); // eslint-disable-line

  if (!props.show) {
    return null;
  }

  props.setLoading(loading);

  const submit = async (e) => {
    e.preventDefault();

    if (selectedAuthor && birthYear && !isNaN(birthYear)) {
      editBorn({ variables: { id: selectedAuthor.value, born: Number(birthYear) } });
    } else {
      alert("Check author and birthyear");
    }
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data
            ? data.allAuthors.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.born}</td>
                  <td>{a.bookCount}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
      <div style={styles.editAuthorContainer}>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <Select value={selectedAuthor} onChange={setSelectedAuthor} options={authorOptions}></Select>
          <span>Born</span>
          <input type="number" value={birthYear} onChange={({ target }) => setBirthYear(target.value)} />
          <button type="submit">Update author</button>
        </form>
      </div>
    </div>
  );
};

export default Authors;
