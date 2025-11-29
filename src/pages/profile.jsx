
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import "../css/profile.css"; // tu CSS personalizado
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
        navigate("/login");
        return;
        }
        setUser(JSON.parse(storedUser));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    if (!user) {
        return (
        <div className="container text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Cargando perfil...</p>
        </div>
        );
    }

    return (
        <React.Fragment>

            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Profile</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
            <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Raleway:ital@0;1&family=Sacramento&display=swap" rel="stylesheet"></link>
            <link rel="icon" href="images/logo.png" type="image/x-icon"></link>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

            <Header />
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg p-4 profile-card text-center">
                <div className="d-flex justify-content-center">
                <img
                    src={user.picture}
                    alt="Profile"
                    className="rounded-circle shadow profile-img"
                />
                </div>

                <h1 className="mt-3 fw-bold">{user.name}</h1>
                <p className="text-muted">{user.email}</p>

                <button
                onClick={handleLogout}
                className="btn btn-danger px-4 mt-3"
                >
                Logout
                </button>
            </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}
