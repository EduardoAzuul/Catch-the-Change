import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './js/AuthContext';
import ProtectedRoute from './js/ProtectedRoute';
import Landing from './pages/Landing';
import MainPage from './pages/main';
import Endagered from './pages/endangered_species';
import Fishing from './pages/fishing_activity';
import Recommendations from './pages/recommendations';
import Posts from './pages/posts';
import Profile from './pages/profile';
import Login from './components/login';

//Loading and defining protected and not protected routes
const App = () => {
    return (
        <GoogleOAuthProvider clientId="506755432338-pn9so2lvkvlsjru9dq065e7vfnf29iur.apps.googleusercontent.com">
            <AuthProvider>
                <Router>
                    <Routes>
        
                        <Route path="/" element={<Landing />} />
                        <Route path="/main" element={<MainPage />} />
                        <Route path="/endangered_species" element={<Endagered />} />
                        <Route path="/fishing_activity" element={<Fishing />} />
                        <Route path="/recommendations" element={<Recommendations />} />
                        <Route path="/login" element={<Login />} />

                        <Route 
                            path="/posts" 
                            element={
                                <ProtectedRoute>
                                    <Posts />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route 
                            path="/profile" 
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
};

export default App;