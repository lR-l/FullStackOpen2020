import React from "react";
import PropTypes from "prop-types";

const LoginForm = ({ statusMessage, onSubmit, username, setUsername, password, setPassword }) => {
  return (
    <div>
      <h2>Log in to application</h2>
      {statusMessage ? (
        <div className={statusMessage.err ? "errorMessage" : "infoMessage"}>
          <span>{statusMessage.msg}</span>
        </div>
      ) : null}
      <form onSubmit={onSubmit}>
        <div className="formRowContainer">
          <span className="formInputText">Username:</span>
          <input
            type="text"
            value={username}
            name="user"
            id="loginUsername"
            onChange={({ target }) => {
              setUsername(target.value);
            }}
          ></input>
        </div>
        <div className="formRowContainer">
          <span className="formInputText">Password:</span>
          <input
            type="password"
            value={password}
            name="pwd"
            id="loginPassword"
            onChange={({ target }) => {
              setPassword(target.value);
            }}
          ></input>
        </div>
        <button id="loginButton" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  statusMessage: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
};

export default LoginForm;
