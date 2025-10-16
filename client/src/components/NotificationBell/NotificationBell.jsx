import React, { useState } from 'react';
import './notification-bell.css';

const NotificationBell = ({ initialCount = 5 }) => {
  // State to hold the number of unread notifications
  const [unreadCount, setUnreadCount] = useState(initialCount);

  // Function to simulate 'reading' the notifications
  const markAsRead = () => {
    // In a real app, this would trigger an API call
    console.log('Notifications marked as read.');
    setUnreadCount(0);
  };

  return (
    <div className="notification-bell-container" onClick={markAsRead}>
      {/* This is a placeholder for your bell icon. 
        You would replace this with an <img> tag pointing to your bell GIF 
        or an SVG/Font Awesome icon.
      */}
      <span className="bell-icon" role="img" aria-label="notification bell">
        &#128276; {/* Unicode Bell Symbol */}
      </span>
      
      {/* Conditional Rendering: Only render the badge if unreadCount > 0 */}
      {unreadCount > 0 && (
        <div className="notification-badge">
          {/* Display a max of '99+' for large numbers */}
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
