import React, { forwardRef, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const HideButton = styled.button`
  color: #f06464;
  background: transparent;
  display: block;
  float: right;
  font-weight: bold;
  padding: 0.5em;
`;

const ShowButton = styled.button`
  display: block;
  font-weight: bold;
  padding: 0.5em;
`;

const TogglableContainer = styled.div`
  display: block;
  padding: 1em;
  margin: 1em;
  border: 0.2em solid #000;
  width: 20vw;
`;

const ButtonContainer = styled.div`
  text-align: right;
`;

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  if (visible) {
    return (
      <TogglableContainer>
        <ButtonContainer>
          <HideButton onClick={toggleVisibility}>X</HideButton>
        </ButtonContainer>
        {props.children}
      </TogglableContainer>
    );
  } else {
    return (
      <div>
        <ShowButton onClick={toggleVisibility}>{props.buttonName}</ShowButton>
      </div>
    );
  }
});

Togglable.propTypes = {
  buttonName: PropTypes.string.isRequired,
  children: PropTypes.object,
};

Togglable.displayName = "Togglable";

export default Togglable;
