import React from "react";
import { useSelector } from "react-redux";

const styles = {
  info: {
    margin: "1em",
    display: "inline-block",
    padding: "1em",
    border: "0.2em solid #000",
    background: "linear-gradient(90deg, rgba(4, 122, 0, 1) 0%, rgba(85, 186, 45, 1) 46%, rgba(0, 255, 102, 1) 100%)",

    backgroundColor: "#f56a6a",
  },
  error: {
    margin: "1em",
    display: "inline-block",
    padding: "1em",
    border: "0.2em solid #000",
    background: "linear-gradient(90deg, rgba(122, 0, 0, 1) 0%, rgba(186, 45, 45, 1) 46%, rgba(255, 0, 0, 1) 100%)",
    color: "#fff",
  },
};

const Notification = () => {
  const message = useSelector(({ notification }) => notification.message);
  const isError = useSelector(({ notification }) => notification.isError);

  if (!message) {
    return null;
  }

  return <div style={isError ? styles.error : styles.info}>{message}</div>;
};

export default Notification;
