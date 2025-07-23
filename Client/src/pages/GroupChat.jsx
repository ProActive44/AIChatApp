import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../slices/chatSlice";
import api from "../services/api";

const GroupChat = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const user = useSelector((state) => state.auth.user); // adjust this line based on how you store user info

  useEffect(() => {
    if (groupId) {
      dispatch(fetchMessages({ type: "group", id: groupId }));
    }
  }, [dispatch, groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await api.post("/chat/send", {
        groupId,
        content: input,
      });
      setInput("");
      dispatch(fetchMessages({ type: "group", id: groupId }));
    } catch (err) {
      // handle error
    }
  };


  return (
    <div className="flex flex-col h-full max-h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded shadow p-4">
        {messages.map((msg) => {
          const isSender = msg.sender === user.id;
          return (
            <div
              key={msg._id}
              className={`mb-2 flex flex-col ${
                isSender ? "items-end" : "items-start"
              }`}
            >
              <div className="text-xs text-gray-500">
                {msg.senderName || msg.sender}
              </div>
              <div
                className={`inline-block px-2 py-1 rounded-lg ${
                  isSender
                    ? "bg-green-500 text-white"
                    : "bg-green-800 text-white"
                }`}
              >
                {msg.content}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          );
        })}

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
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-r"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default GroupChat;
