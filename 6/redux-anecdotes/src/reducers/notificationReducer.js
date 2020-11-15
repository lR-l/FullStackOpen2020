const notificationReducer = (state = { message: "", timer: null }, action) => {
  switch (action.type) {
    case "SHOW_MESSAGE":
      return { message: action.data.message, timer: action.data.timer };

    case "EMPTY_MESSAGE":
      return { message: "", timer: null };
    default:
      return state;
  }
};

export const setNotificationAction = (message, timeout) => {
  return (dispatch, getState) => {
    const timer = () => {
      return setTimeout(() => {
        dispatch({
          type: "EMPTY_MESSAGE",
        });
      }, timeout * 1000);
    };

    const existingTimer = getState().notification.timer;
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    dispatch({
      type: "SHOW_MESSAGE",
      data: { message, timer: timer() },
    });
  };
};

export default notificationReducer;
