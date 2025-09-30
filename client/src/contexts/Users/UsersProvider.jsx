import { useState } from 'react';
import { UsersContext } from './UsersContext.jsx';

export const UsersProvider = ({ children }) => {

    return (
        <UsersContext.Provider value={{}}>

        </UsersContext.Provider>
    )
}
