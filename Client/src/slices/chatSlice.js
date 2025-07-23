import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';


export const fetchUsers = createAsyncThunk('chat/fetchUsers', async (_, thunkAPI) => {
  const res = await api.get('/chat/users');
  return res.data;
});


export const fetchGroups = createAsyncThunk('chat/fetchGroups', async (_, thunkAPI) => {
  const res = await api.get('/chat/groups');
  return res.data;
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async ({ type, id }, thunkAPI) => {
  if (type === 'personal') {
    const res = await api.get(`/chat/personal/${id}`);
    return res.data;
  } else {
    const res = await api.get(`/chat/group/${id}`);
    return res.data;
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    selected: null, // { type: 'personal'|'group', id }
    users: [],
    groups: [],
    messages: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    selectChat(state, action) {
      state.selected = action.payload;
      state.messages = [];
    },
    clearChat(state) {
      state.selected = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { selectChat, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
