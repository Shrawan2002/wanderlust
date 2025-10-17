import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/api";


interface UserType {
    user:{username:string, email:string}|null;
    loading:boolean;
    error:string|null;
    isLoggedIn:boolean;
    initialized:boolean;
}

const initialValue:UserType = {
    user:null,
    loading:false,
    error:null,
    isLoggedIn:false,
    initialized:false
}
// Example: Async thunk for login
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData:{username:string, email:string, password:string}, thunkAPI) => {
    try {
      const response = await api.post("/signup", userData);
      if(typeof window != 'undefined'){
        localStorage.setItem('accessToken', response.data.token)
      }
      return response.data;
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData:{email:string, password:string}, thunkAPI) => {
    try {
      const response = await api.post("/login", userData);
      if(typeof window != 'undefined'){
        localStorage.setItem('accessToken', response.data.token)
      }
      return response.data;
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/me',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: initialValue,
  reducers: {
    markInitialized: (state) => {
      state.initialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.initialized = false; // so UI won’t flicker
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        // Assuming your login response is structured like the signup response
        state.user = action.payload.user; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        // The payload should now be a string from the rejectWithValue above
        state.error = action.payload as string; 
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        // Assuming your login response is structured like the signup response
        state.user = action.payload.user;
        state.initialized = true; 
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        // The payload should now be a string from the rejectWithValue above
        state.error = action.payload as string; 
        state.initialized = true;
      });
  },
});
export const { logout, markInitialized } = authSlice.actions;
export default authSlice.reducer;
