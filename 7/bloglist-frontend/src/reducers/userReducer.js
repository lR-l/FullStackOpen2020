import loginService from "../services/login";
import userService from "../services/users";
import { showNotification } from "./notificationReducer";

const initialState = { users: [], username: "", password: "", userdata: null };

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INIT_USERS":
      return { ...state, users: action.data.users };
    case "LOGIN":
      return { username: "", password: "", userdata: action.data.userdata };

    case "SET_USERDATA":
      return { ...state, userdata: action.data.userdata };

    case "SET_USERNAME":
      return { ...state, username: action.data.username };

    case "SET_PASSWORD":
      return { ...state, password: action.data.password };

    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

export const initUsersAction = () => {
  return async (dispatch) => {
    try {
      const users = await userService.getAll();
      dispatch({
        type: "INIT_USERS",
        data: { users },
      });
    } catch (err) {
      console.log("Error:", err);
      dispatch(showNotification("Unable to retrive users", true));
    }
  };
};

export const initUserAction = () => {
  return async (dispatch) => {
    const userLogged = window.localStorage.getItem("userToken");
    if (userLogged) {
      const user = JSON.parse(userLogged);
      dispatch({
        type: "SET_USERDATA",
        data: { userdata: user },
      });
    }
  };
};

export const setUserDataAction = (userdata) => {
  return {
    type: "SET_USERDATA",
    data: { userdata },
  };
};

export const setUsernameAction = (username) => {
  return {
    type: "SET_USERNAME",
    data: { username },
  };
};

export const setPasswordAction = (password) => {
  return {
    type: "SET_PASSWORD",
    data: { password },
  };
};

export const loginAction = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(username, password);
      window.localStorage.setItem("userToken", JSON.stringify(user));
      dispatch({
        type: "LOGIN",
        data: {
          userdata: user,
        },
      });
    } catch (err) {
      console.log("Error:", err);
      dispatch(showNotification("Wrong credentials", true));
    }
  };
};

export const logoutAction = (routerHistory) => {
  return async (dispatch) => {
    window.localStorage.removeItem("userToken");
    routerHistory.push("/");
    dispatch({
      type: "LOGOUT",
    });
    dispatch(showNotification("Logged out", false));
  };
};

export default userReducer;
