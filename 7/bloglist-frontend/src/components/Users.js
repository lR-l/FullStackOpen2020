import React, { useEffect } from "react";
import User from "./User";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";
import { initUsersAction } from "../reducers/userReducer";
import styled from "styled-components";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 5fr;
  grid-template-rows: 1fr;
`;

const HeaderText = styled.span`
  grid-column-start: 2;
  grid-column-end: 2;
  font-weight: bold;
`;

const UserLink = styled(Link)`
  grid-column-start: 1;
  grid-column-end: 1;
`;

const Text = styled(HeaderText)`
  grid-column-start: 2;
  grid-column-end: 2;
`;

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(({ user }) => user.users);

  const baseRoute = useRouteMatch();
  const getUserIdFromRoute = useRouteMatch(`${baseRoute.path}/:id`);
  const user = getUserIdFromRoute ? users.find((user) => user.id === getUserIdFromRoute.params.id) : null;

  useEffect(() => {
    dispatch(initUsersAction());
  }, []);

  if (!users) {
    return null;
  }

  return (
    <div>
      <h2>Users</h2>
      <Switch>
        <Route path={`${baseRoute.path}/:id`}>
          <User user={user}></User>
        </Route>
        <Route path={baseRoute.path}>
          <GridContainer>
            <HeaderText>blogs created</HeaderText>

            {users.map((user) => (
              <>
                <UserLink to={`${baseRoute.url}/${user.id}`}>
                  <span>{user.name}</span>
                </UserLink>
                <Text>{user.blogs.length}</Text>
              </>
            ))}
          </GridContainer>
        </Route>
      </Switch>
    </div>
  );
};

export default Users;
