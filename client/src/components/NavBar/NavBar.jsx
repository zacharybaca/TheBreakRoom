import './nav-bar.css';
import { useToggle } from '../../hooks/useToggle';
import SlideOutMenu from '../SlideOutMenu/SlideOutMenu.jsx';

const NavBar = () => {
  const { notificationsOn, handleToggleClick, menuOpen, setMenuOpen } = useToggle();

  return (
    <nav id="nav-bar-container">
      <div id="menu-icon-container">
        
        {/* LEFT — Notifications */}
        <div id="notification-icon">
          <div id="notifications-group">
            <h3>Notifications:</h3>
            <img
              src={notificationsOn ? '/assets/switch-on.png' : '/assets/switch-off.png'}
              onClick={handleToggleClick}
              alt="notification toggle"
              className="nav-bar-images"
            />
            <img
              src={
                notificationsOn
                  ? '/assets/notification-number-bell.gif'
                  : '/assets/notifications-off.gif'
              }
              className="nav-bar-images-default"
              alt="notification bell"
            />
          </div>
        </div>

        {/* CENTER — App Logo & Slogan */}
        <div id="app-icon">
          <div id="app-icon-container">
            <img
              src="/assets/nine2five-app-icon.gif"
              id="app-logo"
              alt="Nine2Five app logo"
            />
            <h1 className="slogan">
              The Platform for the People Who Keep Things Moving.
            </h1>
            <h2 className="slogan">
              From the Breakroom to the World... We Speak.
            </h2>
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
