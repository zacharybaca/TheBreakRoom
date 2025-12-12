import { useState, useEffect } from 'react';
import './comment-section.css';
import { useFetcher } from '../../hooks/useFetcher';
import { useAuth } from '../../hooks/useAuth';
import { FaTrash, FaUserCircle } from 'react-icons/fa';

const CommentSection = ({ postId, onCommentAdded, onCommentDeleted }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { fetcher } = useFetcher();
  const { user } = useAuth();

  // 1. Fetch Comments on Mount
  useEffect(() => {
    const fetchComments = async () => {
      // Use the route: GET /api/comments/:postId
      const { success, data } = await fetcher(`/api/comments/${postId}`);
      if (success && data.comments) {
        setComments(data.comments);
      }
      setIsLoading(false);
    };

    if (postId) fetchComments();
  }, [postId]);

  // 2. Add Comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Optimistic Update (Optional, but makes it feel snappy)
    // We can't do full optimistic UI easily because we need the Author ID/Avatar populated
    // So we'll rely on the API response which returns the populated comment.

    const { success, comment } = await fetcher('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ postId, content: newComment }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (success) {
      setComments([...comments, comment]); // Add to bottom of list
      setNewComment('');
      if (onCommentAdded) onCommentAdded(); // Notify parent to update count
    } else {
      alert('Failed to post comment.');
    }
  };

  // 3. Delete Comment
  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    // Optimistic Remove
    const prevComments = [...comments];
    setComments(comments.filter((c) => c._id !== commentId));

    const { success } = await fetcher(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (success) {
      if (onCommentDeleted) onCommentDeleted(); // Notify parent to update count
    } else {
      alert('Failed to delete.');
      setComments(prevComments); // Revert
    }
  };

  if (isLoading)
    return (
      <div style={{ padding: '10px', fontSize: '0.9rem' }}>
        Loading comments...
      </div>
    );

  return (
    <div className="comment-section">
      {/* Input Area */}
      <form className="comment-input-wrapper" onSubmit={handleSubmit}>
        <input
          type="text"
          className="comment-input"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={!newComment.trim()}
        >
          Post
        </button>
      </form>

      {/* List Area */}
      <div className="comment-list">
        {comments.length === 0 && (
          <p style={{ color: '#999', fontSize: '0.9rem', textAlign: 'center' }}>
            No comments yet. Be the first!
          </p>
        )}

        {comments.map((comment) => {
          // Check if current user owns this comment
          const isOwner =
            user?._id === comment.authorId?._id || user?.role === 'admin';

          return (
            <div key={comment._id} className="comment-item">
              {/* Avatar */}
              {comment.authorId?.avatarUrl ? (
                <img
                  src={
                    comment.authorId.avatarUrl.startsWith('http')
                      ? comment.authorId.avatarUrl
                      : `${import.meta.env.VITE_BACKEND_URL}${comment.authorId.avatarUrl}`
                  }
                  alt="Avatar"
                  className="comment-avatar"
                />
              ) : (
                <FaUserCircle
                  className="comment-avatar"
                  style={{ padding: '2px', color: '#ccc' }}
                />
              )}

              {/* Bubble */}
              <div className="comment-bubble">
                <div className="comment-header">
                  <div>
                    <span className="comment-author">
                      {comment.authorId?.name || 'Unknown'}
                    </span>
                    {comment.authorId?.job && (
                      <span className="comment-job">
                        • {comment.authorId.job.title || comment.authorId.job}
                      </span>
                    )}
                  </div>

                  {isOwner && (
                    <button
                      className="comment-delete-btn"
                      onClick={() => handleDelete(comment._id)}
                      title="Delete Comment"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                <div className="comment-text">{comment.content}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
