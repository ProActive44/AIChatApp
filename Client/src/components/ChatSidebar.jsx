import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, fetchGroups, selectChat } from "../slices/chatSlice";

const ChatSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, groups, selected } = useSelector((state) => state.chat);
  const user = useSelector((state) => state.auth.user);
  const [loadingUsers, setLoadingUsers] = React.useState(true);
  const [loadingGroups, setLoadingGroups] = React.useState(true);

  useEffect(() => {
    setLoadingUsers(true);
    setLoadingGroups(true);

    dispatch(fetchUsers())
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoadingUsers(false));

    dispatch(fetchGroups())
      .catch((err) => console.error("Error fetching groups:", err))
      .finally(() => setLoadingGroups(false));
  }, [dispatch]);

  // Exclude self from users
  const filteredUsers = (users || []).filter((u) => u._id !== user?.id);
  // Only show groups user is a member of
  const filteredGroups = (groups || []).filter((g) =>
    g.members?.includes(user?.id)
  );

  const handleUserClick = (u) => {
    dispatch(selectChat({ type: "personal", id: u._id }));
    navigate(`/chat/${u._id}`);
  };
  const handleGroupClick = (g) => {
    dispatch(selectChat({ type: "group", id: g._id }));
    navigate(`/group/${g._id}`);
  };

  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">Chats</h2>
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Users</h3>
        {loadingUsers ? (
          <div className="text-gray-400 px-3 py-2">Loading users...</div>
        ) : (
          <ul>
            {filteredUsers.map((user) => (
              <li
                key={user._id}
                className={`cursor-pointer px-3 py-2 rounded mb-1 hover:bg-blue-100 ${selected?.type === 'personal' && selected?.id === user._id ? 'bg-blue-200 font-bold' : ''}`}
                onClick={() => handleUserClick(user)}
              >
                {user.name || user.username || user.email}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="text-md font-medium mb-2">Groups</h3>
        {loadingGroups ? (
          <div className="text-gray-400 px-3 py-2">Loading groups...</div>
        ) : (
          <ul>
            {filteredGroups.map((group) => (
              <li
                key={group._id}
                className={`cursor-pointer px-3 py-2 rounded mb-1 hover:bg-green-100 ${selected?.type === 'group' && selected?.id === group._id ? 'bg-green-200 font-bold' : ''}`}
                onClick={() => handleGroupClick(group)}
              >
                {group.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
