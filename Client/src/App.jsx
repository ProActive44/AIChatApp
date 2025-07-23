
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';

import PersonalChat from './pages/PersonalChat';
import GroupChat from './pages/GroupChat';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat/:userId" element={<PersonalChat />} />
            <Route path="/group/:groupId" element={<GroupChat />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
