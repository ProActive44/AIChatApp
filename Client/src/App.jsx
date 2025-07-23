

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './store/store';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PersonalChat from './pages/PersonalChat';
import GroupChat from './pages/GroupChat';
import ChatLayout from './components/ChatLayout';


function AppRoutes() {
  const user = useSelector(state => state.auth.user);
  return (
    <Router>
      <div className={user ? "min-h-screen flex flex-col" : "min-h-screen bg-gray-100 flex flex-col"}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} /> 
            {/* If logged in, / routes to chat layout, else redirect to login */}
            <Route path="/" element={user ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
            <Route element={<ChatLayout />}>
              <Route path="/chat/:userId" element={<PersonalChat />} />
              <Route path="/group/:groupId" element={<GroupChat />} />
              <Route path="/chat" element={<div className="flex items-center justify-center h-full text-gray-500">Select a user to start chatting.</div>} />
              <Route path="/group" element={<div className="flex items-center justify-center h-full text-gray-500">Select a group to start chatting.</div>} />
              <Route path="/*" element={<div className="flex items-center justify-center h-full text-gray-500">Chat not found.</div>} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
