import './user-card.css';

const UserCard = (props) => {
  return (
    <div id="user-card">
      <img src={props.image} alt="user" />
      <h3>Name: {props.firstName} {props.lastName}</h3>
      <p>Username: {props.username}</p>
      <p>Email: {props.email}</p>
    </div>
  );
};

export default UserCard;
