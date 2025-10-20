import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { PostsContext } from './PostsContext.jsx';

export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

        socket.on('postCreated', (post) => {
            console.log('New post received:', post);
            setPosts((prevPosts) => [post, ...prevPosts]);
        });

        return () => {
            socket.off('postCreated');
            socket.disconnect();
        };
    }, []);

    return <PostsContext.Provider value={{ posts }}>
        {children}
    </PostsContext.Provider>;
};
