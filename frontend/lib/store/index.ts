// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import listingReducer from './listingSlice'
// If you have other slices, import them too
// import postReducer from "./postSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingReducer
    // posts: postReducer, // example of combining another reducer
  },
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
