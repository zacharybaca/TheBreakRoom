import './nav-bar.css'
import { useToggle } from '../../hooks/useToggle';
import SlideOutMenu from '../SlideOutMenu/SlideOutMenu.jsx';

const NavBar = () => {
  const { notificationsOn, handleToggleClick, menuOpen, setMenuOpen } = useToggle();

  return (
    <nav id="nav-bar-container">
      <div id="menu-icon-container">
        <div id="notification-icon">
          <div id="notifications-group">
            <h3>Notifications: </h3>
            {!notificationsOn ? <img src="/assets/switch-off.png" onClick={handleToggleClick} alt="toggle off switch" className="nav-bar-images" />
              : <img src="/assets/switch-on.png" onClick={handleToggleClick} alt="toggle on switch" className="nav-bar-images" />
            }
            {!notificationsOn ? <img src="/assets/notifications-off.gif" className="nav-bar-images-default" alt="regular notification bell" /> : <img src="/assets/notification-number-bell.gif" className="nav-bar-images-default" alt="notifications off icon" />}
          </div>
        </div>

        <div id="menu-icon">
          <img src="/assets/menu-icon.gif" onClick={() => setMenuOpen(true)} className="nav-bar-images" alt="menu icon" />
        </div>
      </div>

      <SlideOutMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </nav>
  )

}

export default NavBar;
