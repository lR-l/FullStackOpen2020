import blogService from "../services/blogs";
import { showNotification } from "./notificationReducer";

const initialState = { blogs: [], sorting: null, title: "", author: "", url: "" };

const sortingByLikes = (blogs, sorting) => {
  if (sorting === null) {
    return blogs;
  }

  return blogs.sort((a, b) => {
    if (a.likes > b.likes) {
      return sorting ? 1 : -1;
    }
    if (a.likes < b.likes) {
      return sorting ? -1 : 1;
    }
    return 0;
  });
};

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INIT_BLOGS": {
      return { ...state, blogs: action.data.blogs };
    }
    case "CREATE_BLOG":
      return { ...state, blogs: sortingByLikes(state.blogs.concat(action.data.blog), state.sorting), title: "", author: "", url: "" };

    case "UPDATE_BLOG":
      return { ...state, blogs: sortingByLikes(state.blogs.map((blog) => (blog.id !== action.data.blog.id ? blog : action.data.blog))) };

    case "DELETE_BLOG":
      return { ...state, blogs: sortingByLikes(state.blogs.filter((blog) => blog.id !== action.data.id)) };

    case "SET_SORTING":
      return { ...state, blogs: sortingByLikes(state.blogs, action.data.sorting), sorting: action.data.sorting };

    case "SET_TITLE":
      return { ...state, title: action.data.title };

    case "SET_AUTHOR":
      return { ...state, author: action.data.author };

    case "SET_URL":
      return { ...state, url: action.data.url };

    default:
      return state;
  }
};

export const initBlogsAction = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll();
      dispatch({
        type: "INIT_BLOGS",
        data: { blogs },
      });
    } catch (err) {
      console.log("Error:", err);
      dispatch(showNotification("Unable to retrive blogs", true));
    }
  };
};

export const toggleSortingAction = (sorting) => {
  return {
    type: "SET_SORTING",
    data: { sorting },
  };
};

export const setTitleAction = (title) => {
  return {
    type: "SET_TITLE",
    data: { title },
  };
};

export const setAuthorAction = (author) => {
  return {
    type: "SET_AUTHOR",
    data: { author },
  };
};

export const setUrlAction = (url) => {
  return {
    type: "SET_URL",
    data: { url },
  };
};

export const createBlogAction = (title, author, url) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().user.userdata.token;
      const blog = await blogService.create(title, author, url, token);
      dispatch({
        type: "CREATE_BLOG",
        data: { blog },
      });
      dispatch(showNotification(`Blog created successfully! (${title})`, false));
    } catch (err) {
      console.log(err);
      dispatch(showNotification("Unable to create blog", true));
    }
  };
};

export const likeBlogAction = (id, likes) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().user.userdata.token;
      const blog = await blogService.like(id, likes, token);
      dispatch({
        type: "UPDATE_BLOG",
        data: { blog },
      });
      dispatch(showNotification(`Updated "${blog.title}" likes`, false));
    } catch (err) {
      console.log(err);
      dispatch(showNotification("Unable to update blog likes", true));
    }
  };
};

export const addCommentToBlogAction = (id, text) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().user.userdata.token;
      const blog = await blogService.comment(id, text, token);
      dispatch({
        type: "UPDATE_BLOG",
        data: { blog },
      });
      dispatch(showNotification(`Added comment to "${blog.title}" blog`, false));
    } catch (err) {
      console.log(err);
      dispatch(showNotification("Unable to add comment to blog", true));
    }
  };
};

export const deleteBlogAction = (id, title) => {
  return async (dispatch, getState) => {
    if (window.confirm(`Do you want to delete "${title}" blog`)) {
      try {
        const token = getState().user.userdata.token;
        await blogService.deleteEntry(id, token);
        dispatch({
          type: "DELETE_BLOG",
          data: { id },
        });
        dispatch(showNotification(`Deleted blog "${title}"`, false));
      } catch (err) {
        console.log(err);
        dispatch(showNotification("Unable to delete blog", true));
      }
    }
  };
};

export default blogReducer;
