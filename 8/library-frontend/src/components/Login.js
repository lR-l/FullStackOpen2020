import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const Login = ({ errorCallback, onLogin }) => {
  const [username, setUsername] = useState("User");
  const [password, setPassword] = useState("nope.exe@0x12f23b");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      //console.log(error);
      errorCallback(error.message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      onLogin(token);
      localStorage.setItem("login-token", token);
    }
  }, [result]); //eslint-disable-line

  const submit = async (event) => {
    event.preventDefault();

    login({
      variables: { username, password },
    });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          born
          <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
