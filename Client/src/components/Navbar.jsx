// Navigation bar for switching routes
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">AI Chat App</div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/signup" className="hover:underline">Signup</Link>
        <Link to="/login" className="hover:underline">Login</Link>
      </div>
    </nav>
  );
}
