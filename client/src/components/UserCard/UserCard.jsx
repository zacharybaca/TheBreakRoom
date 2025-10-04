import './user-card.css';
import { FaUser, FaUserTag, FaEnvelope } from "react-icons/fa";

const UserCard = (props) => {
  return (
    <div
      id="user-card"
      className={`attachment-${props.attachment}`}
      style={{ transform: `rotate(${props.tilt}deg)` }}
    >

      <div className={`attachment-deco ${props.attachment}`
      } />

      <div id="user-card">
        <img src={props.image} alt="user" />

        <h3 className="info-text name-font-alt-style info-line">
          <FaUser className="card-icon" />
          <span>Name: {props.firstName} {props.lastName}</span>
        </h3>

        <p className="info-text info-line">
          <FaUserTag className="card-icon" />
          <span>Username: {props.username}</span>
        </p>

        <p className="info-text info-line">
          <FaEnvelope className="card-icon" />
          <span>Email: {props.email}</span>
        </p>
      </div>
    </div>
  );
};

export default UserCard;
