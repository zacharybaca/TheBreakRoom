import { useState } from 'react';
import { ToggleContext } from './ToggleContext.jsx';

export const ToggleProvider = ({ children }) => {
    const [notificationsOn, setNotificationsOn] = useState(false);

    return (
        <ToggleContext.Provider value={{
            notificationsOn,
            setNotificationsOn
        }}>
            {children}
        </ToggleContext.Provider>
    )
}
