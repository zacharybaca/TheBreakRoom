import './nav-bar.css';
import { useToggle } from '../../hooks/useToggle';
import SlideOutMenu from '../SlideOutMenu/SlideOutMenu.jsx';
import NotificationBell from '../NotificationBell/NotificationBell.jsx';

const NavBar = () => {
  const { notificationsOn, handleToggleClick, menuOpen, setMenuOpen } =
    useToggle();

  return (
    <nav id="nav-bar-container">
      <div id="menu-icon-container">
        {/* LEFT — Notifications/Bell Icon Signifying if Notifications are On or Off */}
        <div id="notification-icon">
          <div id="notifications-group">
            <img
              src={
                notificationsOn
                  ? '/assets/switch-on.png'
                  : '/assets/switch-off.png'
              }
              onClick={handleToggleClick}
              alt="notification toggle"
              className="nav-bar-images"
            />
            {notificationsOn ? (
              <NotificationBell />
            ) : (
              <img
                src="/assets/notifications-off.png"
                className="nav-bar-images-default"
                alt="notification-bell"
              />
            )}
          </div>
        </div>

        {/* CENTER — App Logo & Slogan */}
        <div id="app-icon">
          <div id="app-icon-container">
            <img
              src="/assets/breakroom_official_app_logo.png"
              id="app-logo"
              alt="Breakroom official app logo"
            />
            <h1 className="slogan">Your Breakroom......Online.</h1>
          </div>
        </div>

        {/* RIGHT — Menu Button */}
        <div id="menu-icon">
          <img
            src="/assets/menu-icon.gif"
            onClick={() => setMenuOpen(true)}
            className="nav-bar-images"
            alt="menu icon"
          />
        </div>
      </div>

      <SlideOutMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </nav>
  );
};

export default NavBar;
