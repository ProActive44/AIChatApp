import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const GroupChat = () => {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Optionally, poll for new messages
    // const interval = setInterval(fetchMessages, 3000);
    // return () => clearInterval(interval);
  }, [groupId]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/group/${groupId}`);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      // handle error
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await api.post('/chat/send', {
        groupId,
        content: input,
      });
      setInput('');
      fetchMessages();
    } catch (err) {
      // handle error
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full max-h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded shadow p-4">
        {messages.map((msg) => (
          <div key={msg._id} className={`mb-2 flex flex-col ${msg.sender === groupId ? 'items-end' : 'items-start'}`}>
            <div className="text-xs text-gray-500">{msg.senderName || msg.sender}</div>
            <div className="inline-block px-4 py-2 rounded-lg bg-green-100 text-gray-800">
              {msg.content}
            </div>
            <div className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          className="flex-1 border rounded-l px-4 py-2 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-r">Send</button>
      </form>
    </div>
  );
};

export default GroupChat;
