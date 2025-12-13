import { useState } from 'react';
import './message-card.css';
import {
  FaRegCommentDots,
  FaUserCircle,
  FaHeart,
  FaTrash,
  FaFlag,
} from 'react-icons/fa';
import CommentSection from '../CommentSection/CommentSection';

const MessageCard = ({
  postId,
  sender,
  message,
  attachment,
  tilt,
  reactionCounts,
  commentCount,
  isOwner,
  onDelete,
  onReport,
  onCommentChange,
}) => {
  const [showComments, setShowComments] = useState(false);

  // Default tilt if none provided
  const cardTilt = tilt ?? (Math.random() * 4 - 2).toFixed(2);

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
          {/* 1. Header: Clean Font (Poppins) */}
          <div className="card-header">
            <span className="user-info">
              <FaUserCircle className="card-icon" />
              <span>
                <span className="info-text-title">From:</span>
                {sender}
              </span>
            </span>

            <div className="action-btn-group">
              <button
                onClick={onReport}
                className="action-btn report-btn"
                title="Report this post"
              >
                <FaFlag />
              </button>

              {isOwner && (
                <button
                  onClick={onDelete}
                  className="action-btn delete-btn"
                  title="Delete Post"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>

          {/* 2. Body: Handwriting Font (Indie Flower) */}
          <div className="card-body">{message}</div>

          {/* 3. Footer: Stats & Toggles */}
          <div className="message-card-footer">
            <span className="stat-item" title="Total Reactions">
              <FaHeart style={{ color: '#e0245e' }} />
              {totalReactions}
            </span>

            <span
              className="stat-item"
              title="Toggle Comments"
              onClick={() => setShowComments(!showComments)}
            >
              <FaRegCommentDots style={{ color: '#1da1f2' }} />
              {totalComments} Comments
            </span>
          </div>

          {/* 4. Comments Section */}
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
