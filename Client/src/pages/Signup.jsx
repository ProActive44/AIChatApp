// Signup page component

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(state => state.auth);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(signup(form)).then(res => {
      if (res.type === 'auth/signup/fulfilled') {
        navigate('/login');
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 ">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form className="space-y-4 w-full max-w-sm" onSubmit={handleSubmit}>
        <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
}
