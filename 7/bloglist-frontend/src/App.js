import React, { useEffect } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { initUserAction } from "./reducers/userReducer";
import { initBlogsAction } from "./reducers/blogReducer";
import { Switch, Route } from "react-router-dom";
import NavigationMenu from "./components/NavigationMenu";
import Users from "./components/Users";
import Blogs from "./components/Blogs";

const App = () => {
  const dispatch = useDispatch();
  const userData = useSelector(({ user }) => user.userdata);

  useEffect(() => {
    dispatch(initUserAction());
    dispatch(initBlogsAction());
  }, []);

  if (userData === null) {
    return <LoginForm></LoginForm>;
  } else {
    return (
      <div>
        <NavigationMenu></NavigationMenu>
        <Notification></Notification>
        <Switch>
          <Route path="/users">
            <Users></Users>
          </Route>
          <Route path="/">
            <Blogs></Blogs>
          </Route>
        </Switch>
      </div>
    );
  }
};

export default App;
