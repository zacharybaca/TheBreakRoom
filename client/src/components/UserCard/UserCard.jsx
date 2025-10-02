import './user-card.css';

const UserCard = (props) => {
  return (
    <div id="user-card">
      <img src={props.image} alt="user" />
      <h3 className="info-text name-font-alt-style">
        <img src="/assets/name-usercard-icon.png" alt="" className="card-icon" />
        Name: {props.firstName} {props.lastName}
      </h3>

      <p className="info-text">
        <img src="/assets/username-usercard-icon.png" alt="" className="card-icon" />
        Username: {props.username}
      </p>
      
      <p className="info-text">
        <img src="/assets/mail-usercard-icon.png" alt="" className="card-icon" />
        Email: {props.email}
      </p>
    </div>
  );
};

export default UserCard;
