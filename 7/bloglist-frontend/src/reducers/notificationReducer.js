const initialState = { message: "", isError: false, timer: null };

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_INFO_NOTIFICATION":
      return { message: action.data.message, isError: false, timer: action.data.timer };

    case "SHOW_ERROR_NOTIFICATION":
      return { message: action.data.message, isError: true, timer: action.data.timer };

    case "HIDE_NOTIFICATION":
      return initialState;
    default:
      return state;
  }
};

export const showNotification = (message, isError) => {
  return (dispatch, getState) => {
    const timer = () => {
      return setTimeout(() => {
        dispatch({
          type: "HIDE_NOTIFICATION",
        });
      }, 5000);
    };

    const existingTimer = getState().notification.timer;
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const type = isError ? "SHOW_ERROR_NOTIFICATION" : "SHOW_INFO_NOTIFICATION";
    dispatch({
      type,
      data: { message, timer: timer() },
    });
  };
};

export default notificationReducer;
