import { useContext } from 'react';
import { SocketContext } from '../contexts/Socket/SocketContext.jsx';

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
