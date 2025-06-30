import {
  LogOut,
  MessageCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = ({ user, sidebarOpen, onToggle, onLogout }) => {
  const navigate = useNavigate();

  // 🌐 Subject state (default: "general")
  const [subject, setSubject] = useState(() => {
    return localStorage.getItem("subject") || "general";
  });

  // 🧠 Save subject selection to localStorage
  useEffect(() => {
    localStorage.setItem("subject", subject);
  }, [subject]);

  return (
    <div
      className={`h-full bg-[#1a1a1a] border-r border-[#2e2e2e] flex flex-col text-white shadow-md transition-all duration-300 ${
        sidebarOpen ? "w-[260px]" : "w-[60px]"
      }`}
    >
      {/* Logo + Toggle Button */}
      <div className="p-4 border-b border-[#2e2e2e] flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <MessageCircle className="text-purple-500 h-6 w-6" />
          {sidebarOpen && (
            <h1 className="text-lg font-bold text-purple-500">EduBot</h1>
          )}
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white sm:flex hidden"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Chat List + Subject Dropdown */}
      <div className="flex-1 overflow-y-auto p-4">
        {sidebarOpen && (
          <>
            <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              Chats
            </h3>
            <div className="bg-[#2a2a2a] rounded-lg p-3 cursor-pointer hover:bg-[#333] mb-4">
              <div className="font-semibold">General Chat</div>
              <p className="text-xs text-gray-400 truncate">Welcome back!</p>
            </div>
          </>
        )}
      </div>

      {/* User Info & Buttons */}
      <div className="border-t border-[#2e2e2e] p-4">
        <div className="flex items-center gap-3 mb-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="h-8 w-8 rounded-full object-cover border border-purple-500"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-purple-600 flex justify-center items-center text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}

          {sidebarOpen && (
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#2e2e2e] hover:bg-[#3b3b3b] rounded-md text-sm font-medium"
          >
            <Settings className="h-4 w-4" />
            {sidebarOpen && "Settings"}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#2e2e2e] hover:bg-[#3b3b3b] rounded-md text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
