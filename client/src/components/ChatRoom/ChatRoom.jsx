import './chat-room.css';
import io from 'socket.io-client';
import MessageCard from '../MessageCard/MessageCard.jsx';

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
        <section className="chat-room-wrapper">
            <div id="chat-room-frame">
                <div id="messages-container">
                    <MessageCard
                        sender="Alice"
                        message="Hello, everyone! Excited to be here."
                        attachment="pushpin"
                    />
                    <MessageCard
                        sender="Bob"
                        message="Hi Alice! Welcome to the chat room."
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
    )
}

export default ChatRoom;
