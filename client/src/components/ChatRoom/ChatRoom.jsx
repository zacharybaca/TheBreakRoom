import './chat-room.css';
import MessageCard from '../MessageCard/MessageCard.jsx';
import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket.js';


const ChatRoom = () => {
  const { socket, isConnected, joinRoom, sendMessage } = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("general");

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
      console.log("💬 Message received:", data);
    };

    socket.on("receive_message", handleReceiveMessage);

    // join default room
    joinRoom(room);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, room, joinRoom]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage(room, message);
    setMessages((prev) => [...prev, { sender: "You", message }]);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <section className="chat-room-wrapper">
        <h1 className="chat-room-heading">Welcome to The Breakroom ☕</h1>
        <p className="chat-room-subtitle">
          {isConnected
            ? "Connected. Grab a coffee and chat away."
            : "Connecting to chat server..."}
        </p>

        <div id="chat-room-frame">
          <div id="messages-container">
            {messages.length === 0 ? (
              <p className="no-messages">No messages yet — say something!</p>
            ) : (
              messages.map((msg, i) => (
                <MessageCard
                  key={i}
                  sender={msg.sender || "Anonymous"}
                  message={msg.message}
                  attachment="tack"
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="message-box-wrapper">
        <div id="message-box-frame">
          <div id="message-box-container">
            <textarea
              id="message-box-message-area"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              id="send-message-btn"
              onClick={handleSendMessage}
              disabled={!isConnected}
            >
              {isConnected ? "Send 💬" : "Connecting..."}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatRoom;
