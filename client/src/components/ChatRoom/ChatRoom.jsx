import './chat-room.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connection', () => {
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
        <div id="chat-room-container">
            <h1>Chat Room Component</h1>
        </div>
    )
}

export default ChatRoom;
