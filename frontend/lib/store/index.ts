// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
// If you have other slices, import them too
// import postReducer from "./postSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // posts: postReducer, // example of combining another reducer
  },
});

export default store;
