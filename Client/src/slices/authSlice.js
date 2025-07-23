import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const userFromStorage = JSON.parse(localStorage.getItem('user')) || null;

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
});

export const signup = createAsyncThunk('auth/signup', async (data, thunkAPI) => {
  const res = await api.post('/auth/signup', data);
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
