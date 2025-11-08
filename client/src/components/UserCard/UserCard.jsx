import './user-card.css';
import { FaUser, FaUserTag, FaEnvelope } from 'react-icons/fa';

const UserCard = (props) => {
  // Random tilt between -2 and 2 degrees for subtle realism
  const tilt = props.tilt ?? (Math.random() * 4 - 2).toFixed(2);

  return (
    <div className="user-card-wrapper">
      <div
        className={`user-card ${props.attachment}`}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {/* Decorative attachment (pushpin, tape, tack) handled via CSS */}
        <div className="user-card-content">
          {props.image && (
            <img
              src={props.image}
              alt={`${props.firstName} ${props.lastName}`}
              className="user-card-img"
            />
          )}

          <h3 className="name-font-alt-style info-line item">
            <FaUser className="card-icon" />
            <span>
              <p className="info-text-title">Name:</p> {props.firstName}{' '}
              {props.lastName}
            </span>
          </h3>

          <p className="info-text info-line item">
            <FaUserTag className="card-icon" />
            <span>
              <p className="info-text-title">Username: </p> {props.username}
            </span>
          </p>

          <p className="info-text info-line item">
            <FaEnvelope className="card-icon" />
            <span>
              <p className="info-text-title">E-mail: </p> {props.email}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
