import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import { Menu } from "lucide-react";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="h-screen w-full flex bg-[#0d0d0d] text-white relative">
      {/* Sidebar Desktop */}
      <div
        className={`hidden sm:block transition-all duration-300 fixed top-0 left-0 h-full z-30 ${
          sidebarOpen ? "w-[260px]" : "w-[60px]"
        }`}
      >
        <Sidebar
          user={user}
          sidebarOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />
      </div>

      {/* Sidebar Mobile */}
      <div
        className={`sm:hidden fixed top-0 left-0 h-full w-[260px] z-50 bg-[#1a1a1a] transition-transform duration-300 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          user={user}
          sidebarOpen={true}
          onToggle={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      {/* Toggle Button (Mobile) */}
      <button
        className="absolute top-4 left-4 z-50 sm:hidden bg-purple-600 hover:bg-purple-700 text-white p-2 rounded"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col h-full w-full transition-all duration-300 ${
          sidebarOpen ? "sm:ml-[260px]" : "sm:ml-[60px]"
        }`}
      >
        <ChatArea user={user} />
      </div>
    </div>
  );
};

export default Chat;
