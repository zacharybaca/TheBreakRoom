import { AuthContext } from './AuthContext.jsx';


export const AuthProvider = ({ children }) => {

    return (
        <AuthContext.Provider>
            {children}
        </AuthContext.Provider>
    )
}
