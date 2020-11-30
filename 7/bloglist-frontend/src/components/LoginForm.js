import React from "react";
import Notification from "./Notification";
import { useSelector, useDispatch } from "react-redux";
import { setUsernameAction, setPasswordAction, loginAction } from "../reducers/userReducer";
import styled from "styled-components";

const FormRowContainer = styled.div`
  display: flex;
  margin: 0.5em 0em;
`;

const FormRowContainerText = styled.span`
  flex: 1;
  margin-right: 1em;
`;

const StyledLoginForm = styled.form`
  width: 20vw;
  background-color: #bbb;
  padding: 1em;
`;

const ButtonContainer = styled.div`
  text-align: right;
`;

const LoginForm = () => {
  const dispatch = useDispatch();

  const username = useSelector(({ user }) => user.username);
  const password = useSelector(({ user }) => user.password);

  const login = async (e) => {
    e.preventDefault();
    dispatch(loginAction(username, password));
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification></Notification>
      <StyledLoginForm onSubmit={login}>
        <FormRowContainer>
          <FormRowContainerText>Username:</FormRowContainerText>
          <input
            type="text"
            value={username}
            name="user"
            id="loginUsername"
            onChange={({ target }) => {
              dispatch(setUsernameAction(target.value));
            }}
          ></input>
        </FormRowContainer>
        <FormRowContainer>
          <FormRowContainerText>Password:</FormRowContainerText>
          <input
            type="password"
            value={password}
            name="pwd"
            id="loginPassword"
            onChange={({ target }) => {
              dispatch(setPasswordAction(target.value));
            }}
          ></input>
        </FormRowContainer>
        <ButtonContainer>
          <button id="loginButton" type="submit">
            Login
          </button>
        </ButtonContainer>
      </StyledLoginForm>
    </div>
  );
};

export default LoginForm;
