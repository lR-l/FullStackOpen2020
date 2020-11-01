import React from "react";
import "./Notifications.css";

const Notification = ({ data }) => {
  if (data.message === null) {
    return null;
  }

  const borderColor = data.isError ? "red" : "green";

  return (
    <div className="notification">
      <span className="message" style={{ borderColor: borderColor }}>
        {data.message}
      </span>
    </div>
  );
};

export default Notification;
