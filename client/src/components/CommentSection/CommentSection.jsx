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

  useEffect(() => {
    const fetchComments = async () => {
      const { success, data } = await fetcher(`/api/comments/${postId}`);
      if (success && data.comments) {
        setComments(data.comments);
      }
      setIsLoading(false);
    };

    if (postId) fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { success, comment } = await fetcher('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ postId, content: newComment }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (success) {
      setComments([...comments, comment]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } else {
      alert('Failed to post comment.');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    const prevComments = [...comments];
    setComments(comments.filter((c) => c._id !== commentId));

    const { success } = await fetcher(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (success) {
      if (onCommentDeleted) onCommentDeleted();
    } else {
      alert('Failed to delete.');
      setComments(prevComments);
    }
  };

  if (isLoading)
    return (
      <div
        style={{
          padding: '10px',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          color: '#666',
        }}
      >
        Loading thoughts...
      </div>
    );

  return (
    <div className="comment-section">
      {/* List Area */}
      <div className="comment-list">
        {comments.length === 0 && (
          <p
            style={{
              color: '#777',
              fontSize: '0.9rem',
              textAlign: 'center',
              fontStyle: 'italic',
              marginBottom: '15px',
            }}
          >
            No notes here yet. Add one below!
          </p>
        )}

        {comments.map((comment) => {
          const isOwner =
            user?._id === comment.authorId?._id || user?.role === 'admin';

          // Robust Avatar URL handling
          let avatarSrc = null;
          if (comment.authorId?.avatarUrl) {
            avatarSrc = comment.authorId.avatarUrl.startsWith('http')
              ? comment.authorId.avatarUrl
              : `${import.meta.env.VITE_BACKEND_URL}${comment.authorId.avatarUrl}`;
          }

          return (
            <div key={comment._id} className="comment-item">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="comment-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }} // Hide if broken
                />
              ) : (
                <FaUserCircle
                  className="comment-avatar"
                  style={{
                    padding: '2px',
                    color: '#888',
                    background: 'transparent',
                    border: 'none',
                  }}
                />
              )}

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

      {/* Input Area (Moved to bottom for better flow) */}
      <form
        className="comment-input-wrapper"
        onSubmit={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        <input
          type="text"
          className="comment-input"
          placeholder="Write a reply..."
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
    </div>
  );
};

export default CommentSection;
