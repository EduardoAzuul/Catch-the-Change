import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

//If the user logged in, shows the profile info and comunnity posts. if not, shows log in page.
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
        }}>
            Loading...
        </div>
        );
    }
    
    return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;