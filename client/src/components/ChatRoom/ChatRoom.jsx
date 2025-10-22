import './chat-room.css';
import io from 'socket.io-client';
import MessageCard from '../MessageCard/MessageCard.jsx';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to chat server with ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from chat server');
});

socket.on('chatMessage', (message) => {
  console.log('New chat message received:', message);
});

const ChatRoom = () => {
  return (
    <>
      <section className="chat-room-wrapper">
        <h1>Welcome to The Breakroom</h1>
        <p className="subheading">Your space to vent, connect, and unwind.</p>

        <div id="chat-room-frame">
          <div id="messages-container">
            <MessageCard
              sender="Alice"
              message="Hello, everyone! Excited to be here."
              attachment="pushpin"
            />
            <MessageCard
              sender="Bob"
              message="Hi Alice! Welcome to The Breakroom."
              attachment="tape"
            />
            <MessageCard
              sender="Charlie"
              message="Good to see new faces here!"
              attachment="tack"
            />
          </div>
        </div>
      </section>

      <section className="message-box-wrapper">
        <div id="message-box-frame">
          <div id="message-box-container">
            <textarea
              id="message-box-message-area"
              placeholder="Type your message here..."
              cols="30"
              rows="30"
            ></textarea>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatRoom;
