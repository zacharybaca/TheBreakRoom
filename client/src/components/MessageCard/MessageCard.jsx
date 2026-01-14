import './message-card.css';
import {
  FaRegCommentDots,
  FaUserCircle,
  FaHeart,
  FaTrash,
} from 'react-icons/fa';
import DOMPurify from 'dompurify';

const MessageCard = ({
  sender,
  message,
  attachment,
  tilt,
  reactionCounts,
  commentCount,
  isOwner,
  onDelete,
  onReaction, // NEW PROP
  onCommentChange, // Placeholder for future comment click
}) => {
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
          {/* Header */}
          <h3 className="message-font-alt-style info-line item">
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FaUserCircle className="card-icon" />
              <span>
                <span className="info-text-title">From:</span> {sender}
              </span>
            </span>

            {isOwner && (
              <button
                onClick={onDelete}
                className="delete-btn"
                title="Delete Post"
              >
                <FaTrash />
              </button>
            )}
          </h3>

          {/* Body */}
          <div className="info-text info-line item" style={{ flexGrow: 1 }}>
            <FaRegCommentDots
              className="card-icon"
              style={{ marginTop: '4px' }}
            />
            <span>
              <span className="info-text-title">Message: </span>
              {/* FIX: Changed to inline to prevent awkward line breaks */}
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(message),
                }}
                style={{ display: 'inline' }}
              />
            </span>
          </div>

          {/* Footer: Stats */}
          <div className="message-card-footer">
            {/* 1. LIKE BUTTON (Interactive) */}
            <button
              onClick={onReaction}
              className="stat-btn"
              title="Like this post"
            >
              <FaHeart className="stat-icon" style={{ color: '#e0245e' }} />
              {totalReactions}
            </button>

            {/* 2. COMMENT COUNT (Non-interactive for now, serves as display) */}
            <div className="stat-display" title="Comments">
              <FaRegCommentDots
                className="stat-icon"
                style={{ color: '#1da1f2' }}
              />
              {totalComments}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
