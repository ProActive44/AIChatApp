import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import chatReducer from '../slices/chatSlice';
import uiReducer from '../slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
});

export default store;
