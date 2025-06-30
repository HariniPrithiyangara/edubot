const ChatBubble = ({ message, userAvatar }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
        {isUser ? userAvatar : "🤖"}
      </div>

      {/* Message content */}
      <div className="flex flex-col gap-1">
        <div
          className={`px-4 py-2 rounded-2xl max-w-xs ${
            isUser
              ? "bg-purple-600 text-white rounded-br-md"
              : "bg-gray-800 text-white rounded-bl-md"
          }`}
        >
          {/* 🎤 Audio message */}
          {message.audio ? (
            <audio controls src={message.audio} className="w-full mt-1" />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>
          )}
        </div>

        {/* 🕒 Timestamp */}
        <span className="text-xs text-gray-400 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;
