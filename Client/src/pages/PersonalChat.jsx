import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../slices/chatSlice';
import api from '../services/api';
import { getSocket } from '../services/socket';

const PersonalChat = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const messages = useSelector(state => state.chat.messages);
  const currentUser = useSelector(state => state.auth.user); // 👈 Get logged-in user
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    const s = getSocket(localStorage.getItem('token'));
    setSocket(s);
    s.emit('setup', currentUser);
    s.on('connected', () => {
      s.emit('join chat', userId);
    });
    s.on('message received', (msg) => {
      if ((msg.receiver === currentUser.id && msg.sender === userId) || (msg.sender === currentUser.id && msg.receiver === userId)) {
        dispatch(fetchMessages({ type: 'personal', id: userId }));
      }
    });
    s.on('typing', () => setOtherTyping(true));
    s.on('stop typing', () => setOtherTyping(false));
    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line
  }, [currentUser, userId, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMessages({ type: 'personal', id: userId }));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (socket) {
      socket.emit('new message', {
        recipientId: userId,
        content: input,
      });
    }
    setInput('');
    dispatch(fetchMessages({ type: 'personal', id: userId }));
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket) return;
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', userId);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop typing', userId);
    }, 1200);
  };


  return (
    <div className="flex flex-col h-full max-h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded shadow p-4">
        {messages.map((msg) => {
          const isSender = msg.sender === currentUser.id;
          return (
            <div
              key={msg._id}
              className={`mb-2 flex flex-col ${isSender ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`inline-block px-2 py-1 rounded-lg ${
                  isSender
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-800 text-white'
                }`}
              >
                {msg.content}
              </div>
              <div className="text-xs text-gray-400">{new Date(msg.timestamp || msg.createdAt).toLocaleString()}</div>
            </div>
          );
        })}
        {otherTyping && (
          <div className="text-xs text-blue-400 mb-2">Typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          className="flex-1 border rounded-l px-4 py-2 focus:outline-none"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r">Send</button>
      </form>
    </div>
  );
};

export default PersonalChat;
