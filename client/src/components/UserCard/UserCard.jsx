import './user-card.css';
import { FaUser, FaUserTag, FaEnvelope } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg"; 

const UserCard = (props) => {
  return (
    <div id="user-card">
      <img src={props.image} alt="user" />

      <h3 className="info-text name-font-alt-style">
        <FaUser className="card-icon" />
        Name: {props.firstName} {props.lastName}
      </h3>

      <p className="info-text">
        <FaUserTag className="card-icon" />
        Username: {props.username}
      </p>
      
      <p className="info-text">
        <FaEnvelope className="card-icon" />
        Email: {props.email}
      </p>

      <p className="info-text">
        <CgWebsite className="card-icon" />
        Website: {props.website}
      </p>
    </div>
  );
};

export default UserCard;
