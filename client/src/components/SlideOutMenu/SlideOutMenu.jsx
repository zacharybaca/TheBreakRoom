import './slide-out-menu.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToggle } from '../../hooks/useToggle.js';
import { Button, CloseButton } from 'react-bootstrap';
import Avatar from '../Avatar/Avatar.jsx';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton.jsx';
const SlideOutMenu = ({ isOpen, onClose }) => {
  const { isAuthenticated, logoutUser } = useAuth();
  const { privateProfile, handleTogglePrivateProfile } = useToggle();

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="backdrop" onClick={onClose}></div>}

      {/* Slideout Menu */}
      <div className={`slideout ${isOpen ? 'open' : ''}`}>
        <CloseButton className="close-btn" onClick={onClose}></CloseButton>
        {/* <button className="close-btn" onClick={onClose}>×</button> */}
        {isAuthenticated ? (
          <div className="log-off-on-button-container">
            <Link to="/">
              <button type="button" onClick={logoutUser}>
                <img src="/assets/log-off.png" alt=" log off icon" />
                <h3>Log Off</h3>
              </button>
            </Link>
          </div>
        ) : (
          <div className="log-off-on-button-container">
            <Link to="/">
              <button type="button">
                <img src="/assets/log-on.png" alt=" log on icon" />
                <h3>Log On</h3>
              </button>
            </Link>
          </div>
        )}
        <br />
        <div id="private-profile-button-container">
          {!isAuthenticated && (
            <ReusableStyledButton
              onClick={handleTogglePrivateProfile}
              fullWidth={true}
              className="private-toggle-button"
              title={
                privateProfile ? (
                  <img
                    src="/assets/private-icon.png"
                    id="toggle-off"
                    alt="private toggle off icon"
                  />
                ) : (
                  <img
                    src="/assets/public-icon.png"
                    id="toggle-off"
                    alt="private toggle on icon"
                  />
                )
              }
            />
          )}
        </div>

        <ul>
          <li>
            <Link to="/profile">
              <img
                src="/assets/profile-icon.png"
                className="menu-image-class"
                alt="profile icon"
              />
              My Profile
            </Link>
          </li>
          <hr />
          <li>
            <Link to="/feed">
              <img
                src="/assets/news-feed-icon.png"
                className="menu-image-class"
                alt="news feed icon"
              />{' '}
              Community Feed
            </Link>
          </li>
          <hr />
          <li>
            <Link to="/settings">
              <img
                src="/assets/settings-icon.png"
                className="menu-image-class"
                alt="settings icon"
              />
              Settings
            </Link>
          </li>
          <hr />
          <li>
            <Link to="/breakrooms">
              <img
                src="/assets/break-room-icon.png"
                className="menu-image-class"
                alt="breakroom icon"
              />
              Breakrooms
            </Link>
          </li>
          <hr />
          <li>
            <Link to="/breakrooms/create">
              <img
                src="/assets/create-breakroom.png"
                className="menu-image-class"
                alt="create breakroom icon"
              />
              Create Breakroom
            </Link>
          </li>
          <hr />
          <li>
            <Link to="/admin-settings">
              <img
                src="/assets/admin-settings-icon.png"
                className="menu-image-class"
                alt="admin settings icon"
              />
              Admin Settings
            </Link>
          </li>
          <hr />
          <li>
            <Link to="/chatroom">
              <img
                src="/assets/chat-room.png"
                className="menu-image-class"
                alt="chat room icon"
              />
              Chat Room
            </Link>
          </li>
        </ul>
        <Button variant="danger" id="delete-button">
          Delete Account
        </Button>
        <hr />
        <Avatar />
      </div>
    </>
  );
};

export default SlideOutMenu;
