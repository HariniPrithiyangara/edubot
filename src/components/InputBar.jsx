import { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, Smile, BookOpen } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const subjects = ["general", "math", "science", "computer", "english", "history", "coding"];

const InputBar = ({ onSendText, onSendFile }) => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState(() => localStorage.getItem("subject") || "general");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [listening, setListening] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const emojiRef = useRef(null);
  const recognitionRef = useRef(null);

  // Emoji picker outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      sendText(voiceText);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleMicClick = () => recognitionRef.current?.start();

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
  };

  const sendText = async (text) => {
    if (!text.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("You're not logged in.");
    onSendText(text, subject); // ← pass message and subject to parent
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendText(message);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("You're not logged in.");

    const formData = new FormData();
    let endpoint = "";

    if (file.type === "application/pdf") {
      formData.append("pdf", file);
      endpoint = "pdf";
    } else if (file.type.startsWith("image/")) {
      formData.append("image", file);
      endpoint = "image";
    } else {
      alert("❌ Only image or PDF files are allowed.");
      return;
    }

    formData.append("subject", subject);
    setUploading(true);

    try {
      onSendFile(file.name, endpoint, formData);
    } catch (err) {
      console.error("File upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-[#1f1f1f] rounded-xl">
        {/* Subject dropdown */}
        <div className="relative">
          <BookOpen className="absolute left-2 top-2.5 text-gray-400" size={16} />
          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              localStorage.setItem("subject", e.target.value);
            }}
            className="appearance-none pl-6 pr-2 py-1 bg-[#2a2a2a] text-sm text-white rounded-md focus:outline-none"
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <button
          type="button"
          className="text-gray-300 hover:text-purple-400"
          onClick={() => fileInputRef.current.click()}
        >
          <Paperclip size={20} />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />

        {/* Emoji Picker */}
        <div className="relative" ref={emojiRef}>
          <button
            type="button"
            className="text-gray-300 hover:text-purple-400"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile size={20} />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 z-50">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
            </div>
          )}
        </div>

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={uploading ? "Analyzing file..." : "Type your message..."}
          disabled={uploading}
          className="flex-1 px-4 py-2 rounded-xl bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Mic */}
        <button
          type="button"
          onClick={handleMicClick}
          className={`${listening ? "text-green-400" : "text-gray-300"} hover:text-purple-400`}
        >
          <Mic size={20} />
        </button>

        {/* Send */}
        <button
          type="submit"
          disabled={!message.trim() || uploading}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-medium disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default InputBar;
