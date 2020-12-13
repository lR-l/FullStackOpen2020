import React, { useEffect, useState } from "react";
import Authors, { ALL_AUTHORS } from "./components/Authors";
import Books, { ALL_GENRES, BOOK_DATA, GET_BOOKS } from "./components/Books";
import NewAuthor from "./components/NewAuthor";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { gql, useApolloClient, useLazyQuery, useSubscription } from "@apollo/client";
import Recommended from "./components/Recommended";

const styles = {
  loadingContainer: {
    width: "100vw",
    height: "100vh",
    position: "absolute",
    zIndex: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    fontWeight: "bold",
    border: "0.2em solid #123",
    borderRadius: "0.5em",
    padding: "2em",
    backgroundColor: "rgb(204, 203, 191)",
  },
  errorContainer: {
    width: "100vw",
    height: "100vh",
    position: "absolute",
    zIndex: 101,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    cursor: "pointer",
  },
  errorText: {
    fontWeight: "bold",
    border: "0.2em solid #123",
    borderRadius: "0.5em",
    padding: "2em",
    backgroundColor: "rgb(255, 111, 111)",
  },
};

const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
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

const getKeyValue = (object, currentKey) => {
  return object[currentKey];
};

const App = () => {
  const [page, setPage] = useState("authors");
  const [getUser, userResult] = useLazyQuery(ME);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const client = useApolloClient();

  const updateCacheWithNewData = ({ query, data, operation }) => {
    //try catch to check if query exsists in cache,
    const cacheQuery = query.variables ? client.readQuery({ query: query.name, variables: query.variables }) : client.readQuery({ query: query.name });
    const cacheData = cacheQuery[query.type];

    if (cacheData) {
      if (operation.type === "insert") {
        const existsInCache = cacheData.some((dataEntry) => {
          const cacheDataCompareValue = operation.cacheKeys.length > 0 ? operation.cacheKeys.reduce(getKeyValue, dataEntry) : dataEntry[operation.cacheKeys[0]];
          const newDataCompareValue = operation.dataKeys.length > 0 ? operation.dataKeys.reduce(getKeyValue, data) : data[operation.dataKeys[0]];

          return cacheDataCompareValue === newDataCompareValue;
        });

        if (!existsInCache) {
          query.variables
            ? client.writeQuery({
                query: query.name,
                data: { [query.type]: cacheData.concat(data) },
                variables: query.variables,
              })
            : client.writeQuery({
                query: query.name,
                data: { [query.type]: cacheData.concat(data) },
              });
        }
      } else if (operation.type === "update") {
        const cacheUpdated = cacheData.some((dataEntry) => {
          const cacheDataCompareValue = operation.cacheKeys.length > 0 ? operation.cacheKeys.reduce(getKeyValue, dataEntry) : dataEntry[operation.cacheKeys[0]];
          const newDataCompareValue = operation.dataKeys.length > 0 ? operation.dataKeys.reduce(getKeyValue, data) : data[operation.dataKeys[0]];

          if (cacheDataCompareValue === newDataCompareValue) {
            return typeof data[operation.dataFieldKey] === "object"
              ? Object.keys(data[operation.dataFieldKey]).every((key) => dataEntry[key] && dataEntry[key] === data[operation.dataFieldKey][key])
              : dataEntry[operation.cacheFieldKey] === data[operation.dataFieldKey];
          }
          return false;
        });

        if (!cacheUpdated) {
          const updateCacheData = cacheData.map((dataEntry) => {
            const cacheDataCompareValue =
              operation.cacheKeys.length > 0 ? operation.cacheKeys.reduce(getKeyValue, dataEntry) : dataEntry[operation.cacheKeys[0]];
            const newDataCompareValue = operation.dataKeys.length > 0 ? operation.dataKeys.reduce(getKeyValue, data) : data[operation.dataKeys[0]];

            return cacheDataCompareValue === newDataCompareValue ? { ...dataEntry, ...data[operation.dataFieldKey] } : dataEntry;
          });

          query.variables
            ? client.writeQuery({
                query: query.name,
                data: { [query.type]: updateCacheData },
                variables: query.variables,
              })
            : client.writeQuery({
                query: query.name,
                data: { [query.type]: updateCacheData },
              });
        }
      }
    } else {
      setErrorMessage("Cache error, invalid query data");
    }
  };

  const setErrorMessage = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const onLogin = (token) => {
    setToken(token);
    getUser();
  };

  const logout = () => {
    setToken(null);
    localStorage.setItem("login-token", "");
    client.resetStore();
  };

  useEffect(() => {
    const loginToken = localStorage.getItem("login-token");
    if (loginToken) {
      setToken(loginToken);
      getUser();
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (userResult.data) {
      setCurrentUser(userResult.data.me);
    }
  }, [userResult]);

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      updateCacheWithNewData({
        query: { name: GET_BOOKS, type: "allBooks" },
        data: subscriptionData.data.bookAdded,
        operation: { type: "insert", cacheKeys: ["id"], dataKeys: ["id"] },
      });
      if (subscriptionData.data.bookAdded.genres.includes(currentUser.favoriteGenre)) {
        updateCacheWithNewData({
          query: { name: GET_BOOKS, type: "allBooks", variables: { genre: currentUser.favoriteGenre } },
          data: subscriptionData.data.bookAdded,
          operation: { type: "insert", cacheKeys: ["id"], dataKeys: ["id"] },
        });
      }
      updateCacheWithNewData({
        query: { name: ALL_AUTHORS, type: "allAuthors" },
        data: subscriptionData.data.bookAdded,
        operation: { type: "update", cacheKeys: ["id"], dataKeys: ["author", "id"], cacheFieldKey: "author", dataFieldKey: "author" },
      });

      const genres = client.readQuery({ query: ALL_GENRES });
      const allGenres = genres.allGenres.filter((genre) => !subscriptionData.data.bookAdded.genres.includes(genre));

      client.writeQuery({
        query: ALL_GENRES,
        data: { ...genres, allGenres: [...allGenres, ...subscriptionData.data.bookAdded.genres] },
      });
    },
  });

  return (
    <div>
      {error ? (
        <div
          style={styles.errorContainer}
          onClick={() => {
            setError(null);
          }}
        >
          <span style={styles.errorText}>{error}</span>
        </div>
      ) : null}
      {loading ? (
        <div style={styles.loadingContainer}>
          <span style={styles.loadingText}>Loading...</span>
        </div>
      ) : null}
      {token ? (
        <>
          <div>
            <button onClick={() => setPage("authors")}>authors</button>
            <button onClick={() => setPage("books")}>books</button>
            <button onClick={() => setPage("add book")}>add book</button>
            <button onClick={() => setPage("add author")}>add author</button>
            <button onClick={() => setPage("recommended")}>recommended</button>
            <button onClick={() => logout()}>logout</button>
          </div>
          <Authors show={page === "authors"} setLoading={setLoading} errorCallback={setErrorMessage} />
          <Books show={page === "books"} setLoading={setLoading} errorCallback={setErrorMessage} />
          <NewBook show={page === "add book"} errorCallback={setErrorMessage} user={currentUser} updateCache={updateCacheWithNewData} />
          <NewAuthor show={page === "add author"} errorCallback={setErrorMessage} />
          <Recommended show={page === "recommended"} setLoading={setLoading} errorCallback={setErrorMessage} user={currentUser}></Recommended>
        </>
      ) : (
        <Login errorCallback={setErrorMessage} onLogin={onLogin} />
      )}
    </div>
  );
};

export default App;
