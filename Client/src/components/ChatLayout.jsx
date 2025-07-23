import React from 'react';
import ChatSidebar from './ChatSidebar';
import { Outlet } from 'react-router-dom';

const ChatLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 min-w-[220px] max-w-xs h-full overflow-y-auto border-r bg-white">
        <ChatSidebar />
      </div>
      <div className="flex-1 h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
