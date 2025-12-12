import { useState, useEffect } from 'react';
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

  // 1. Fetch Posts on Mount
  useEffect(() => {
    const getPosts = async () => {
      const { success, data } = await fetcher('/api/posts');
      if (success) {
        setPosts(data);
      }
      setIsLoading(false);
    };
    getPosts();
  }, []);

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
      setPosts([data, ...posts]);
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

    if (success) {
      alert(
        'Report submitted. Thank you for helping keep the breakroom clean.'
      );
    } else {
      alert(`Failed to report: ${message}`);
    }
  };

  // 5. Handle Comment Count Update (Live Refresh)
  // This allows the "5 comments" number to update when you add a comment
  const handleCommentChange = (postId, newCount) => {
    // Optional optimization: If you want to be super precise, you can update the specific post in the state
    // For now, even just triggering a re-fetch or doing nothing is fine,
    // but passing a callback prevents errors if MessageCard tries to call it.
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
              postId={post._id} // <--- CRITICAL: ADDED THIS LINE
              // Data Props
              sender={post.authorId?.name || 'Unknown Worker'}
              message={post.content}
              reactionCounts={post.reactionCounts}
              commentCount={post.commentCount}
              // Logic Props
              isOwner={user?._id === post.authorId?._id}
              onDelete={() => handleDeletePost(post._id)}
              onReport={() => handleReport(post._id)}
              onCommentChange={() => {
                /* Optional refresh logic */
              }}
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
