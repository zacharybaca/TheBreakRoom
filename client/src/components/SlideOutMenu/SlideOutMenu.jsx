import './slide-out-menu.css';
import { useAuth } from "../../hooks/useAuth";

const SlideOutMenu = ({ isOpen, onClose }) => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {/* Backdrop */}
            {isOpen && <div className="backdrop" onClick={onClose}></div>}

            {/* Slideout Menu */}
            <div className={`slideout ${isOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={onClose}>×</button>
                {isAuthenticated ? <button type="button"><img src="/assets/log-off-icon.png" alt=" log off icon" /></button> : <button type="button"><img src="/assets/log-on-icon.png" alt="log in logo" /></button>}
                <ul>
                    <li><a href="/profile"><img src="/assets/profile-icon.png" className="menu-image-class" alt="profile icon" />My Profile</a></li>
                    <li><a href="/feed"><img src="/assets/news-feed-icon.png" className="menu-image-class" alt="news feed icon" /> Community Feed</a></li>
                    <li><a href="/notifications">Notifications</a></li>
                    <li><a href="/settings"><img src="/assets/settings-icon.png" className="menu-image-class" alt="settings icon" />Settings</a></li>
                </ul>
            </div>
        </>
    )
}

export default SlideOutMenu;
