import './user-card.css';

const UserCard = (props) => {
  return (
    <div id="user-card">
      <img src={props.image} alt="user" />
      <h3 className="info-text name-font-alt-style">Name: {props.firstName} {props.lastName}</h3>
      <p className="info-text">Username: {props.username}</p>
      <p className="info-text">Email: {props.email}</p>
    </div>
  );
};

export default UserCard;
