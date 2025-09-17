import './avatar.css';
import { useAuth } from '../../hooks/useAuth';

const Avatar = () => {
  const { user } = useAuth();

  return (
    <div id="avatar-image-container">
      {user ? (
        <img src={user.avatarUrl} alt="User Avatar" />
      ) : (
        <img src="/assets/Nine2Five-logo.png" alt="app logo" />
      )}
    </div>
  );
};

export default Avatar;
