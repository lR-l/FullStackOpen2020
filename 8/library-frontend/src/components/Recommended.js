import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "./Books";

const Recommended = (props) => {
  const { loading, data } = useQuery(GET_BOOKS, { variables: { genre: props?.user?.favoriteGenre }, skip: !props?.user });
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (data) {
      setBooks(data.allBooks);
    }
  }, [data]);

  if (!props.show || !props.user) {
    return null;
  }

  props.setLoading(loading);

  return (
    <div>
      <h2>Recommended</h2>
      <span>books in your favorite genre</span>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            ? books.map((a) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
