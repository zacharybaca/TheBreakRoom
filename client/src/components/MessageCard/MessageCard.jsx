import './message-card.css';
import { FaRegCommentDots, FaUserCircle } from 'react-icons/fa';

const MessageCard = (props) => {
  // Random tilt between -2 and 2 degrees for subtle realism
  const tilt = props.tilt ?? (Math.random() * 4 - 2).toFixed(2);

  return (
    <div className="message-card-wrapper">
      <div
        className={`message-card ${props.attachment}`}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {/* Decorative attachment (pushpin, tape, tack) handled via CSS */}
        <div className="message-card-content">
          <h3 className="message-font-alt-style info-line item">
            <FaUserCircle className="card-icon" />
            <span>
              <p className="info-text-title">From:</p> {props.sender}
            </span>
          </h3>

          <p className="info-text info-line item">
            <FaRegCommentDots className="card-icon" />
            <span>
              <p className="info-text-title">Message: </p> {props.message}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
