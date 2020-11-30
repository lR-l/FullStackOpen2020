import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../reducers/userReducer";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const NavigationMenuContainer = styled.div`
  display: flex;
  align-items: center;
  border: 0.2em solid #123;
  background: linear-gradient(180deg, rgba(0, 119, 255, 1) 0%, rgba(43, 209, 255, 1) 50%, rgba(92, 255, 250, 1) 100%);
  color: #123;
  padding: 0.25em;
`;

const LinkContainer = styled.div`
  margin: 0 0.2em;
`;

const NavigationMenuText = styled.span`
  margin: 0 0.2em;
`;

const NavigationMenuButton = styled.button`
  margin-left: 0.5em;
  background: linear-gradient(180deg, rgba(176, 191, 209, 1) 0%, rgba(134, 144, 156, 1) 100%);
  border: 0.1em solid #cec;
`;

const MenuLink = styled(Link)`
  color: #000;
  font-weight: Bold;

  &:visited {
    color: #c800c5;
  }
`;

const NavigationMenu = () => {
  const dispatch = useDispatch();
  const routerHistory = useHistory();
  const userData = useSelector(({ user }) => user.userdata);

  const padding = {
    paddingRight: 5,
  };
  return (
    <NavigationMenuContainer>
      <LinkContainer>
        <MenuLink to="/users" style={padding}>
          users
        </MenuLink>
        <MenuLink to="/" style={padding}>
          blogs
        </MenuLink>
      </LinkContainer>
      <NavigationMenuText className="welcomeText">{userData.name} logged in</NavigationMenuText>
      <NavigationMenuButton onClick={() => dispatch(logoutAction(routerHistory))}>Logout</NavigationMenuButton>
    </NavigationMenuContainer>
  );
};

export default NavigationMenu;
