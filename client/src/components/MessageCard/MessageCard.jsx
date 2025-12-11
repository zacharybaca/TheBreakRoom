import { useState } from 'react';
import './message-card.css';
import { FaRegCommentDots, FaUserCircle, FaHeart, FaTrash, FaFlag } from 'react-icons/fa';
import CommentSection from '../CommentSection/CommentSection';

const MessageCard = ({
  postId, // <--- We need this to fetch the specific comments
  sender,
  message,
  attachment,
  tilt,
  reactionCounts,
  commentCount,
  isOwner,
  onDelete,
  onReport,
  onCommentChange // Optional: Function to refresh parent if count changes
}) => {
  // 1. State to toggle comments
  const [showComments, setShowComments] = useState(false);

  // 2. Calculate random tilt if not provided
  const cardTilt = tilt ?? (Math.random() * 4 - 2).toFixed(2);

  // 3. Helper: Sum up all reaction types
  const totalReactions = reactionCounts
    ? Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)
    : 0;

  const totalComments = commentCount || 0;

  return (
    <div className="message-card-wrapper">
      <div
        className={`message-card ${attachment || 'pushpin'}`}
        style={{ '--tilt': `${cardTilt}deg` }}
      >
        <div className="message-card-content">

          {/* Header: Sender Info + Actions */}
          <h3 className="message-font-alt-style info-line item" style={{ justifyContent: 'space-between' }}>
            {/* Left side: Avatar + Name */}
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FaUserCircle className="card-icon" />
              <span>
                <span className="info-text-title">From:</span> {sender}
              </span>
            </span>

            {/* Right side: Action Buttons (Report + Delete) */}
            <div style={{ display: 'flex', gap: '8px' }}>

              {/* Report Button */}
              <button
                onClick={onReport}
                className="action-btn report-btn"
                title="Report this post"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#888',
                  padding: '4px'
                }}
              >
                <FaFlag />
              </button>

              {/* Delete Button */}
              {isOwner && (
                <button
                  onClick={onDelete}
                  className="action-btn delete-btn"
                  title="Delete Post"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#dc3545',
                    padding: '4px'
                  }}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </h3>

          {/* Body: Message */}
          <div className="info-text info-line item" style={{ flexGrow: 1 }}>
            <FaRegCommentDots className="card-icon" style={{ marginTop: '4px' }} />
            <span>
              <span className="info-text-title">Message: </span>
              {message}
            </span>
          </div>

          {/* Footer: Stats (Likes & Comments) */}
          <div className="message-card-footer">
            <span title="Total Reactions">
              <FaHeart className="stat-icon" style={{ color: '#e0245e' }} />
              {totalReactions}
            </span>

            {/* Toggle Comments on Click */}
            <span
              title="Toggle Comments"
              onClick={() => setShowComments(!showComments)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <FaRegCommentDots className="stat-icon" style={{ color: '#1da1f2' }} />
              {totalComments}
            </span>
          </div>

          {/* 4. Render Comment Section if Open */}
          {showComments && (
            <CommentSection
              postId={postId}
              onCommentAdded={onCommentChange}
              onCommentDeleted={onCommentChange}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default MessageCard;
