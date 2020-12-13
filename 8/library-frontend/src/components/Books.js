import React, { useState, useEffect } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";

const styles = {
  filterContainer: {
    marginBottom: 10,
  },
  filterLabel: {
    fontWeight: "bold",
    marginRight: "1em",
  },
};

export const BOOK_DATA = gql`
  fragment BookData on Book {
    id
    title
    published
    genres
  }
`;

export const GET_BOOKS = gql`
  query getBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      ...BookData
      author {
        id
        name
      }
    }
  }
  ${BOOK_DATA}
`;

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`;

const Books = (props) => {
  const [getAllBooks, { loading, data }] = useLazyQuery(GET_BOOKS);
  const genreQuery = useQuery(ALL_GENRES);
  const [getBooks, result] = useLazyQuery(GET_BOOKS); //{ loading, data} = result
  const [authorFilter, setAuthorFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState(null);

  const filterBooks = (event) => {
    event.preventDefault();
    getBooks({ variables: { author: authorFilter, genre: genreFilter } });
  };

  useEffect(() => {
    if (!result.data) {
      getAllBooks();
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (genreQuery.data) {
      setGenres(genreQuery.data.allGenres);
    }
  }, [genreQuery.data]);

  useEffect(() => {
    if (data) {
      setBooks(data.allBooks);
    }
  }, [data]);

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks);
    }
  }, [result]);

  if (!props.show) {
    return null;
  }

  props.setLoading(loading);

  const getGenreButtons = () => {
    if (!genres) {
      return null;
    }

    const buttons = genres.map((genre) => (
      <button
        key={genre}
        onClick={() => {
          setGenreFilter(genre);
          getBooks({ variables: { author: authorFilter, genre: genre } });
        }}
      >
        {genre}
      </button>
    ));

    buttons.unshift(
      <button
        key="All"
        onClick={() => {
          setGenreFilter("");
          getBooks({ variables: { author: authorFilter, genre: "" } });
        }}
      >
        All
      </button>
    );

    return buttons;
  };

  return (
    <div>
      <h2>books</h2>
      <div>
        <form onSubmit={filterBooks}>
          <div style={styles.filterContainer}>
            <span style={styles.filterLabel}>Filter by author</span>
            <input value={authorFilter} onChange={({ target }) => setAuthorFilter(target.value)} />
            <button type="submit">Filter</button>
          </div>
        </form>
      </div>
      <div style={styles.filterContainer}>
        <span style={styles.filterLabel}>Filter by genre</span>
        {getGenreButtons()}
      </div>

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

export default Books;
