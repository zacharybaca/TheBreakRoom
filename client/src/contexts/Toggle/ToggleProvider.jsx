import { useState } from 'react';
import { ToggleContext } from './ToggleContext.jsx';

export const ToggleProvider = ({ children }) => {
    const [notificationsOn, setNotificationsOn] = useState(false);

    const handleToggleClick = () => {
        setNotificationsOn(prev => !prev);
    }

    return (
        <ToggleContext.Provider value={{
            notificationsOn,
            handleToggleClick
        }}>
            {children}
        </ToggleContext.Provider>
    )
}
