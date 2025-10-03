import { useState } from 'react';
import { ToggleContext } from './ToggleContext.jsx';

export const ToggleProvider = ({ children }) => {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);

  const handleToggleClick = () => {
    if (notificationsOn) {
      setNotificationsOn(false);
    } else {
      setNotificationsOn(true);
    }
  };

  const handleTogglePrivateProfile = () => {
    if (privateProfile) {
      setPrivateProfile(false);
    } else {
      setPrivateProfile(true);
    }
  };

  return (
    <ToggleContext.Provider
      value={{
        notificationsOn,
        handleToggleClick,
        menuOpen,
        setMenuOpen,
        privateProfile,
        handleTogglePrivateProfile,
      }}
    >
      {children}
    </ToggleContext.Provider>
  );
};
