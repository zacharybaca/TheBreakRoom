import { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket.js';
import { PostsContext } from './PostsContext.jsx';

export const PostsProvider = ({ children }) => {
  const { socket } = useSocket();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handlePostCreated = (post) => {
      console.log('🆕 New post received:', post);
      setPosts((prevPosts) => [post, ...prevPosts]);
    };

    socket.on('postCreated', handlePostCreated);

    return () => {
      socket.off('postCreated', handlePostCreated);
    };
  }, [socket]);

  return (
    <PostsContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostsContext.Provider>
  );
};
