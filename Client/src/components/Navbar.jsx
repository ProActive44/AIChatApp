// Navigation bar for switching routes

import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { toggleTheme } from '../slices/uiSlice';

export default function Navbar() {
  const user = useSelector(state => state.auth.user);
  const theme = useSelector(state => state.ui.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={`p-4 flex justify-between items-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white'}`}>
      <div className="font-bold text-xl">AI Chat App</div>
      <div className="space-x-4 flex items-center">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="px-2 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 mr-2"
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        {!user ? (
          <>
            <Link to="/signup" className="hover:underline">Signup</Link>
            <Link to="/login" className="hover:underline">Login</Link>
          </>
        ) : (
          <>
            <span className="font-semibold">{user.name || user.username || user.email}</span>
            <button onClick={handleLogout} className="ml-2 px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
