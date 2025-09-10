import { useState } from 'react';
import { ToggleContext } from './ToggleContext.jsx';

export const ToggleProvider = ({ children }) => {

    return (
        <ToggleContext.Provider>
            {children}
        </ToggleContext.Provider>
    )
}
