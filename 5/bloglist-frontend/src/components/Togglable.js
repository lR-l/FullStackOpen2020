import React, { forwardRef, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";

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
      <div className="togglableContainer">
        <div>{props.children}</div>
        <div className="togglableCancelButton">
          <button onClick={toggleVisibility}>Cancel</button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <button className="togglableShowButton" onClick={toggleVisibility}>
          {props.buttonName}
        </button>
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
