import './nav-bar.css'
import { useToggle } from '../../hooks/useToggle';

const NavBar = () => {
  const { notificationsOn } = useToggle();

  return (
    <nav id="nav-bar-container">
      <div id="menu-icon-container">
        {notificationsOn ? <img src="/assets/switch-off.png" alt="toggle off switch" className="nav-bar-images" /> : 
          <img src="/assets/switch-on.png" alt="toggle on switch" className="nav-bar-images" />
        }
      </div>
      <div id="app-icon-container">
        <img src="/assets/Nine2Five-logo.png" alt="app logo" />
        <h1 className="slogan">The platform for the people who keep things moving.</h1>
        <h2 className="slogan">From the breakroom to the world — we speak.</h2>
      </div>
      <div id="notification-icon-container">
        {notificationsOn ? <img src="/assets/notification-number-bell.gif" className="nav-bar-images" alt="regular notification bell" /> : <img src="/assets/notifications-off.gif" className="nav-bar-images" alt="notifications off icon" />}
        
      </div>
    </nav>
  )

}

export default NavBar;
