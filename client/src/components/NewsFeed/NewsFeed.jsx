import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { io } from 'socket.io-client';

import './news-feed.css';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import MessageCard from '../MessageCard/MessageCard';
import { useFetcher } from '../../hooks/useFetcher';
import { useAuth } from '../../hooks/useAuth';

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { fetcher } = useFetcher();
  const { user } = useAuth();

  // 1. Fetch Posts & Setup Socket
  useEffect(() => {
    // A. Fetch Initial Posts
    const getPosts = async () => {
      const { success, data } = await fetcher('/api/posts?withReactions=true');
      if (success) {
        setPosts(data);
      }
      setIsLoading(false);
    };
    getPosts();

    // B. Setup Real-time Listener
    // FIX: Use the Environment Variable for the URL
    const socketUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const socket = io(socketUrl);

    socket.on('new_post', (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    return () => {
      socket.off('new_post');
      socket.disconnect();
    };
  }, []);

  // 2. Handle Creating a New Post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.replace(/<(.|\n)*?>/g, '').trim()) return;

    const cleanContent = DOMPurify.sanitize(newPostContent);

    const { success, data } = await fetcher('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ content: cleanContent }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (success) {
      setPosts((prev) => {
        if (prev.find((p) => p._id === data._id)) return prev;
        return [data, ...prev];
      });
      setNewPostContent('');
    }
  };

  // 3. Handle Soft Delete
  const handleDeletePost = async (postId) => {
    const previousPosts = [...posts];
    setPosts(posts.filter((p) => p._id !== postId));

    const { success } = await fetcher(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (!success) {
      alert('Failed to delete post. Please try again.');
      setPosts(previousPosts);
    }
  };

  // 4. Handle Reporting
  const handleReport = async (postId) => {
    const reason = prompt(
      'Why are you reporting this post? (spam, harassment, privacy, etc.)'
    );
    if (!reason) return;

    const { success, message } = await fetcher('/api/reports', {
      method: 'POST',
      body: JSON.stringify({
        targetType: 'Post',
        targetId: postId,
        reason: 'Other',
        description: reason,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (success) alert('Report submitted.');
    else alert(`Failed to report: ${message}`);
  };

  // 5. Handle Reaction (Like)
  const handleReaction = async (postId) => {
    // Optimistic UI Update (assumes +1 for now, real data comes on refresh or complexity)
    // For now, we just trigger the API.
    // You could manually update `reactionCounts` in state here for instant feedback.

    const { success, data } = await fetcher(`/api/posts/${postId}/reactions`, {
        method: 'POST',
        body: JSON.stringify({ type: 'like' }),
        headers: { 'Content-Type': 'application/json' }
    });

    if(success) {
        // Update the specific post with the new reaction count from server
        setPosts(current => current.map(p => p._id === postId ? { ...p, reactionCounts: data.reactionCounts } : p));
    }
  };

  // 6. Handle Comment Count (Placeholder for future comment logic)
  const handleCommentChange = (postId, newCount) => {
    setPosts((currentPosts) =>
      currentPosts.map((p) =>
        p._id === postId ? { ...p, commentCount: newCount } : p
      )
    );
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  return (
    <div id="news-feed-container">
      <div id="news-feed">
        <header className="nf-header">
          <h1>News Feed</h1>
        </header>

        <section className="nf-composer">
          <div className="quill-wrapper">
            <ReactQuill
              theme="snow"
              value={newPostContent}
              onChange={setNewPostContent}
              modules={modules}
              placeholder="Share an update..."
              className="nf-editor"
            />
          </div>
          <ReusableStyledButton
            title="Post"
            type="submit"
            className="nf-submit"
            onClick={handlePostSubmit}
          />
        </section>

        <section className="nf-list">
          {isLoading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>
              Loading breakroom chatter...
            </p>
          ) : (
            posts.map((post) => (
              <MessageCard
                key={post._id}
                postId={post._id}
                sender={post.authorId?.name || 'Unknown Worker'}
                message={post.content}
                reactionCounts={post.reactionCounts}
                commentCount={post.commentCount}
                isOwner={user?._id === post.authorId?._id}
                onDelete={() => handleDeletePost(post._id)}
                onReport={() => handleReport(post._id)}
                // NEW: Pass the reaction handler
                onReaction={() => handleReaction(post._id)}
                onCommentChange={handleCommentChange}
              />
            ))
          )}
          {!isLoading && posts.length === 0 && (
            <p style={{ textAlign: 'center', color: '#999' }}>
              The breakroom is quiet... too quiet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default NewsFeed;
