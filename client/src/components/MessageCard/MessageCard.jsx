import './message-card.css';
import {
  FaRegCommentDots,
  FaUserCircle,
  FaHeart,
  FaTrash,
} from 'react-icons/fa';

const MessageCard = ({
  sender,
  message,
  attachment,
  tilt,
  reactionCounts,
  commentCount,
  isOwner,
  onDelete,
}) => {
  // 1. Calculate random tilt if not provided
  const cardTilt = tilt ?? (Math.random() * 4 - 2).toFixed(2);

  // 2. Helper: Sum up all reaction types (like + love + haha...)
  const totalReactions = reactionCounts
    ? Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)
    : 0;

  const totalComments = commentCount || 0;

  return (
    <div className="message-card-wrapper">
      <div
        className={`message-card ${attachment || 'pushpin'}`} // Default to pushpin if missing
        // 🔧 FIX: We set a CSS variable here instead of a direct transform.
        // This allows the CSS :hover state to override the rotation!
        style={{ '--tilt': `${cardTilt}deg` }}
      >
        <div className="message-card-content">
          {/* Header: Sender & Delete Button */}
          <h3 className="message-font-alt-style info-line item">
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FaUserCircle className="card-icon" />
              <span>
                <span className="info-text-title">From:</span> {sender}
              </span>
            </span>

            {/* Delete Button (Only visible if isOwner is true) */}
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

          {/* Body: Message */}
          <div className="info-text info-line item" style={{ flexGrow: 1 }}>
            <FaRegCommentDots
              className="card-icon"
              style={{ marginTop: '4px' }}
            />
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

            <span title="Comments">
              <FaRegCommentDots
                className="stat-icon"
                style={{ color: '#1da1f2' }}
              />
              {totalComments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
