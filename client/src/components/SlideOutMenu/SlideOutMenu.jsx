import './slide-out-menu.css';

const SlideOutMenu = ({ isOpen, onClose }) => {

    return (
        <>
            {/* Backdrop */}
            {isOpen && <div className="backdrop" onClick={onClose}></div>}

            {/* Slideout Menu */}
            <div className={`slideout ${isOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={onClose}>×</button>
                  <button type="button"><img src="/assets/log-on-icon.png" alt="log in logo" /></button>
                <ul>
                    <li><a href="/profile"><img src="/assets/profile-icon.png" className="menu-image-class" alt="profile icon" />My Profile</a></li>
                    <li><a href="/feed">Community Feed</a></li>
                    <li><a href="/notifications">Notifications</a></li>
                    <li><a href="/settings"><img src="/assets/settings-icon.png" className="menu-image-class" alt="settings icon" />Settings</a></li>
                    <li><a href="/logout">Logout</a></li>
                </ul>
            </div>
        </>
    )
}

export default SlideOutMenu;
