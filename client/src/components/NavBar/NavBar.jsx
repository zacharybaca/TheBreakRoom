import './nav-bar.css'

const NavBar = () => {

  return (
    <nav id="nav-bar-container">
      <div id="menu-icon-container">
        <img src="/assets/switch-off.png" alt="toggle off switch" className="nav-bar-images" />
      </div>
      <div id="app-icon-container">
        <img src="/assets/Nine2Five-logo.png" alt="app logo" />
        <h1 className="slogan">The platform for the people who keep things moving.</h1>
        <h2 className="slogan">From the breakroom to the world — we speak.</h2>
      </div>
      <div id="notification-icon-container">
        <img src="/assets/notification-number-bell.gif" className="nav-bar-images" alt="regular notification bell" />
      </div>
    </nav>
  )

}

export default NavBar;
