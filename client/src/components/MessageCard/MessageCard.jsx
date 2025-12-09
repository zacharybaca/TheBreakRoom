import './message-card.css';
import { FaRegCommentDots, FaUserCircle, FaHeart, FaTrash } from 'react-icons/fa';

const MessageCard = ({
  sender,
  message,
  attachment,
  tilt,
  reactionCounts,
  commentCount,
  isOwner,
  onDelete
}) => {
  // 1. Calculate random tilt if not provided
  const cardTilt = tilt ?? (Math.random() * 4 - 2).toFixed(2);

  // 2. Helper: Sum up all reaction types (like + love + haha...)
  // The backend gives us: { like: 10, love: 5, ... }
  const totalReactions = reactionCounts
    ? Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)
    : 0;

  const totalComments = commentCount || 0;

  return (
    <div className="message-card-wrapper">
      <div
        className={`message-card ${attachment || 'pushpin'}`} // Default to pushpin if missing
        style={{ transform: `rotate(${cardTilt}deg)` }}
      >
        <div className="message-card-content">
          {/* Header: Sender */}
          <h3 className="message-font-alt-style info-line item">
            <FaUserCircle className="card-icon" />
            <span>
              <span className="info-text-title">From:</span> {sender}
            </span>

            {/* 3. Delete Button (Only visible if isOwner is true) */}
            {isOwner && (
              <button
                onClick={onDelete}
                className="delete-btn"
                title="Delete Post"
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#d9534f' }}
              >
                <FaTrash />
              </button>
            )}
          </h3>

          {/* Body: Message */}
          <div className="info-text info-line item" style={{ flexGrow: 1 }}>
            <FaRegCommentDots className="card-icon" style={{ marginTop: '4px' }} />
            <span>
              <span className="info-text-title">Message: </span>
              {message}
            </span>
          </div>

          {/* 4. Footer: Stats (Likes & Comments) */}
          <div className="message-card-footer" style={{
            marginTop: '15px',
            paddingTop: '10px',
            borderTop: '1px dashed rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '15px',
            fontSize: '0.9rem',
            color: '#555'
          }}>
            <span title="Total Reactions" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FaHeart className="stat-icon" style={{ color: '#e0245e' }} />
              {totalReactions}
            </span>

            <span title="Comments" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FaRegCommentDots className="stat-icon" style={{ color: '#1da1f2' }} />
              {totalComments}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MessageCard;
