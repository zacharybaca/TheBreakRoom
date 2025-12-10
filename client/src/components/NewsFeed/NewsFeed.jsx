import { useState, useEffect } from 'react';
import './news-feed.css';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import MessageCard from '../MessageCard/MessageCard'; // Import your card
import { useFetcher } from '../../hooks/useFetcher';
import { useAuth } from '../../hooks/useAuth';

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { fetcher } = useFetcher();
  const { user } = useAuth(); // Needed to check ownership

  // 1. Fetch Posts on Mount
  useEffect(() => {
    const getPosts = async () => {
      // We ask for posts AND their reaction details
      const { success, data } = await fetcher('/api/posts?withReactions=true');
      if (success) {
        setPosts(data);
      }
      setIsLoading(false);
    };
    getPosts();
  }, []); // Empty dependency array = run once on mount

  // 2. Handle Creating a New Post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const { success, data } = await fetcher('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ content: newPostContent }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (success) {
      // Add the new post to the top of the list immediately
      setPosts([data, ...posts]);
      setNewPostContent(''); // Clear input
    }
  };

  // 3. Handle Soft Delete (Optimistic UI)
  const handleDeletePost = async (postId) => {
    // Optimistically remove it from the UI first (feels faster)
    const previousPosts = [...posts];
    setPosts(posts.filter((p) => p._id !== postId));

    const { success } = await fetcher(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    // If API fails, revert the change (put the post back)
    if (!success) {
      alert('Failed to delete post. Please try again.');
      setPosts(previousPosts);
    }
  };

  return (
    <div id="news-feed">
      <header className="nf-header">
        <h1>News Feed</h1>
      </header>

      {/* Composer Section */}
      <section className="nf-composer">
        <textarea
          className="nf-input"
          placeholder="Share an update..."
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        <ReusableStyledButton
          title="Post"
          type="submit"
          className="nf-submit"
          onClick={handlePostSubmit}
        />
      </section>

      {/* List Section */}
      <section className="nf-list">
        {isLoading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            Loading breakroom chatter...
          </p>
        ) : (
          posts.map((post) => (
            <MessageCard
              key={post._id}
              // Data Props
              sender={post.authorId?.name || 'Unknown Worker'}
              message={post.content}
              reactionCounts={post.reactionCounts} // { like: 5, love: 2 }
              commentCount={post.commentCount}
              // Logic Props
              isOwner={user?._id === post.authorId?._id} // Show delete button if owner
              onDelete={() => handleDeletePost(post._id)}
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
  );
};

export default NewsFeed;
