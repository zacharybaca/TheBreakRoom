import { useState } from 'react';
import { ToggleContext } from './ToggleContext.jsx';

export const ToggleProvider = ({ children }) => {
    const [notificationsOn, setNotificationsOn] = useState(true);

    return (
        <ToggleContext.Provider value={{
            notificationsOn
        }}>
            {children}
        </ToggleContext.Provider>
    )
}
