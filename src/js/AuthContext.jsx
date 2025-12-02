import { createContext, useContext, useState, useEffect } from 'react';

//Login data is stored in the context to be passed throughout the code
const AuthContext = createContext();

//protects the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};

//manage the session
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //mataints the session when reloading
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        
        if (savedUser && savedToken) {
        try {
            const userData = JSON.parse(savedUser);
            setUser({ ...userData, token: savedToken });
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        }
        setLoading(false);
    }, []);

    //saves the user info for the session
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.token) {
        localStorage.setItem('token', userData.token);
        }
    };

    //deletes info from the session
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
        </AuthContext.Provider>
  );
};