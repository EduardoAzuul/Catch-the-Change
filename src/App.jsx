import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MainPage from './pages/main';
import Landing from './pages/Landing';
import Recommendations from './pages/recommendations';
import Endagered from './pages/endangered_species';
import Fishing from './pages/fishing_activity';

import './css/main.css'
import './js/app.js';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/endangered_species" element={<Endagered />} />
                <Route path="/fishing_activity" element={<Fishing />} />
                <Route path="/recommendations" element={<Recommendations />} />
            </Routes>
        </Router>
    );
};

export default App;