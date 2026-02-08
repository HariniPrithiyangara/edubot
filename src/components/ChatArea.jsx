import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import InputBar from "./InputBar";

const ChatArea = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 👇 Scroll to bottom on every message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Load chat history on first render
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const apiUrl = window.API_URL || import.meta.env.VITE_API_URL_PROD;
        const res = await fetch(`${apiUrl}/api/chat/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const formatted = data.map((chat) => ({
          id: chat._id,
          text: chat.message,
          sender: chat.sender,
          timestamp: new Date(chat.timestamp),
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("❌ Failed to load chat history:", err);
      }
    };

    fetchHistory();
  }, []);

  // ✅ Handle normal text message send
  const handleSendMessage = async (text, subject) => {
    if (!text.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const userMsg = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    try {
      const apiUrl = window.API_URL || import.meta.env.VITE_API_URL_PROD;
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, subject }),
      });

      const data = await res.json();
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: data.botReply || "No response from EduBot.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: "⚠️ Failed to get AI response.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle file upload (PDF/Image)
  const handleFileUpload = async (fileName, endpoint, formData) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fileMsg = {
      id: Date.now().toString(),
      text: `📎 File: ${fileName}`,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, fileMsg]);

    setLoading(true);
    try {
      const apiUrl = window.API_URL || import.meta.env.VITE_API_URL_PROD;
      const res = await fetch(`${apiUrl}/api/chat/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      const botReply = data.botReply || "No AI response.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: botReply,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("❌ File send failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: "⚠️ Failed to process file.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-[#1e1e1e]">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          <div>
            <h1 className="font-semibold text-white">EduBot</h1>
            <p className="text-sm text-gray-400">
              {loading ? "Thinking..." : "Online • Ask me anything!"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#0f0f0f]">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            userAvatar={user?.name?.[0]?.toUpperCase() || "U"}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-700 bg-[#1e1e1e] p-4">
        <InputBar onSendText={handleSendMessage} onSendFile={handleFileUpload} />
      </div>
    </div>
  );
};

export default ChatArea;
