import './avatar.css';
import { useAuth } from "../../hooks/useAuth";

const Avatar = () => {
    const { user } = useAuth();

    return (
        <div id="avatar-image-container">
            {user && <img src={user.avatarUrl} alt="User Avatar" />}
        </div>
    );
};

export default Avatar;
