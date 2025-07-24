import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../slices/chatSlice";
import api from "../services/api";
import { getSocket } from "../services/socket";

const GroupChat = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const user = useSelector((state) => state.auth.user); // adjust this line based on how you store user info

  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const s = getSocket(localStorage.getItem("token"));
    setSocket(s);
    s.emit("setup", user);
    s.on("connected", () => {
      s.emit("join group", groupId);
    });
    s.on("message received", (msg) => {
      if (msg.group === groupId) {
        dispatch(fetchMessages({ type: "group", id: groupId }));
      }
    });
    s.on("typing", ({ userId }) => {
      // Find user by userId
      if (userId !== user.id) {
        const typingUser = messages.find(m => m.sender._id === userId)?.sender?.username;
        setOtherTyping(typingUser || "Someone");
      }
    });
    s.on("stop typing", () => setOtherTyping(null));
    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line
  }, [user, groupId, dispatch]);

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
    if (socket) {
      socket.emit("new message", {
        groupId,
        content: input,
      });
    }
    setInput("");
    dispatch(fetchMessages({ type: "group", id: groupId }));
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket) return;
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", groupId);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stop typing", groupId);
    }, 1200);
  };

//   console.log(user)


  return (
    <div className="flex flex-col h-full max-h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded shadow p-4">
        {messages.map((msg) => {
          const isSender = msg.sender._id === user.id;
          let senderName = msg.sender.username;
          return (
            <div
              key={msg._id}
              className={`mb-2 flex flex-col ${isSender ? "items-end" : "items-start"}`}
            >
              <div className="text-xs text-gray-500">
                {senderName || "Unknown User"}
              </div>
              <div
                className={`inline-block px-2 py-1 rounded-lg ${isSender ? "bg-green-500 text-white" : "bg-green-800 text-white"}`}
              >
                {msg.content}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          );
        })}
        {otherTyping && (
          <div className="text-xs text-green-400 mb-2">{otherTyping} is typing...</div>
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
