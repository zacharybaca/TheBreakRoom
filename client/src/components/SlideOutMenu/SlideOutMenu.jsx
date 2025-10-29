import './slide-out-menu.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToggle } from '../../hooks/useToggle.js';
import { Button, CloseButton } from 'react-bootstrap';
import Avatar from '../Avatar/Avatar.jsx';
const SlideOutMenu = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
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
          <button type="button">
            <img src="/assets/log-off-icon.png" alt=" log off icon" />
          </button>
        ) : (
          <button type="button">
            <img src="/assets/log-on-icon.png" alt="log in logo" />
          </button>
        )}
        <br />
        <div id="private-profile-button-container">
          {!isAuthenticated ? (
            privateProfile ? (
              <button type="button" onClick={handleTogglePrivateProfile}>
                <img
                  src="/assets/private-icon.png"
                  className="toggle-off"
                  alt="private toggle off icon"
                />
              </button>
            ) : (
              <button type="button" onClick={handleTogglePrivateProfile}>
                <img
                  src="/assets/public-icon.png"
                  alt="private toggle on icon"
                />
              </button>
            )
          ) : (
            ''
          )}
        </div>
        <ul>
          <li>
            <Link to ="/profile">
              <img
                src="/assets/profile-icon.png"
                className="menu-image-class"
                alt="profile icon"
              />
              My Profile
            </Link>
          </li>
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
