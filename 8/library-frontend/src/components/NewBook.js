import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "./Authors";
import { GET_BOOKS, ALL_GENRES, BOOK_DATA } from "./Books";
import Select from "react-select";

const styles = {
  formRow: {
    display: "flex",
    margin: "0.5em",
  },
  formRowLabel: {
    flex: 1,
  },
  formRowComponent: {
    flex: 10,
  },
};

const NEW_BOOK = gql`
  mutation newBook($title: String!, $author: ID!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      ...BookData
      author {
        id
        name
        bookCount
      }
    }
  }
  ${BOOK_DATA}
`;

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const { data } = useQuery(ALL_AUTHORS);
  const [authorOptions, setAuthorOptions] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [newBook] = useMutation(NEW_BOOK, {
    //refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }], // fetch data from server instead of cache
    onError: (error) => {
      //console.log(error);
      props.errorCallback(error.message);
    },
    update: (cache, res) => {
      //use try catch to check if query exsists in cache, if query is lazy
      /*
      const books = cache.readQuery({ query: GET_BOOKS });

      cache.writeQuery({
        query: GET_BOOKS,
        data: { ...books, allBooks: [...books.allBooks, res.data.addBook] },
      });
      */

      props.updateCache({
        query: { name: GET_BOOKS, type: "allBooks" },
        data: res.data.addBook,
        operation: { type: "insert", cacheKeys: ["id"], dataKeys: ["id"] },
      });

      if (res.data.addBook.genres.includes(props.user.favoriteGenre)) {
        /*
        const genreBooks = cache.readQuery({ query: GET_BOOKS, variables: { genre: props.user.favoriteGenre } });

        cache.writeQuery({
          query: GET_BOOKS,
          data: { ...genreBooks, allBooks: [...genreBooks.allBooks, res.data.addBook] },
          variables: { genre: props.user.favoriteGenre },
        });
        */

        props.updateCache({
          query: { name: GET_BOOKS, type: "allBooks", variables: { genre: props.user.favoriteGenre } },
          data: res.data.addBook,
          operation: { type: "insert", cacheKeys: ["id"], dataKeys: ["id"] },
        });
      }

      props.updateCache({
        query: { name: ALL_AUTHORS, type: "allAuthors" },
        data: res.data.addBook,
        operation: { type: "update", cacheKeys: ["id"], dataKeys: ["author", "id"], cacheFieldKey: "author", dataFieldKey: "author" },
      });

      const genres = cache.readQuery({ query: ALL_GENRES });
      const allGenres = genres.allGenres.filter((genre) => !res.data.addBook.genres.includes(genre));

      cache.writeQuery({
        query: ALL_GENRES,
        data: { ...genres, allGenres: [...allGenres, ...res.data.addBook.genres] },
      });
    },
    onCompleted: (data) => {
      setTitle("");
      setPublished("");
      setSelectedAuthor(null);
      setGenres([]);
      setGenre("");
    },
  });

  useEffect(() => {
    if (data) {
      setAuthorOptions(
        data.allAuthors.map((author) => {
          return { value: author.id, label: author.name };
        })
      );
    }
  }, [data]); // eslint-disable-line

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    if (selectedAuthor) {
      newBook({ variables: { title, author: selectedAuthor.value, published: Number(published), genres } });
    } else {
      props.errorCallback("Select author!");
    }
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div style={styles.formRow}>
          <span style={styles.formRowLabel}>title</span>
          <input style={styles.formRowComponent} value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div style={styles.formRow}>
          <span style={styles.formRowLabel}>author</span>
          <div style={styles.formRowComponent}>
            <Select value={selectedAuthor} onChange={setSelectedAuthor} options={authorOptions}></Select>
          </div>
        </div>
        <div style={styles.formRow}>
          <span style={styles.formRowLabel}>published</span>
          <input style={styles.formRowComponent} type="number" value={published} onChange={({ target }) => setPublished(target.value)} />
        </div>
        <div style={styles.formRow}>
          <span style={styles.formRowLabel}>add genre</span>
          <input style={styles.formRowComponent} value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">
            add
          </button>
        </div>
        <div style={styles.formRow}>
          <span style={styles.formRowLabel}>genres:</span>
          <span style={styles.formRowComponent}>{genres.join(" ")}</span>
        </div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
