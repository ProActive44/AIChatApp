// Auth service for API calls
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/auth';

export const signup = async (data) => {
  const res = await axios.post(`${API_URL}/signup`, data);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};
