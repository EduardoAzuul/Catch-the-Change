import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../js/AuthContext';
import Header from './header.jsx';
import Footer from './footer.jsx';

const API_URL = "http://localhost:4000/api";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useAuth();

    const from = location.state?.from?.pathname || '/profile';

    // Si ya está autenticado, redirigir
    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    useEffect(() => {
        // Cargar el script de Google
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: "506755432338-pn9so2lvkvlsjru9dq065e7vfnf29iur.apps.googleusercontent.com",
                callback: handleGoogleResponse
            });

            window.google.accounts.id.renderButton(
                document.getElementById("googleLoginBtn"),
                {
                    theme: "filled_blue",
                    size: "large",
                    shape: "pill"
                }
            );
        };
    }, []);

    const handleGoogleResponse = async (response) => {
        try {
            const res = await fetch(`${API_URL}/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ credential: response.credential })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Guardar en localStorage (como antes)
            localStorage.setItem("token", data.token);
            
            // IMPORTANTE: Guardar también en el contexto para que persista la sesión
            login({
                ...data.user,
                token: data.token // Incluir el token si lo necesitas en otros componentes
            });

            // Redirigir a donde el usuario intentaba ir o al profile
            navigate(from, { replace: true });

        } catch (err) {
            console.error("Error en login:", err);
            alert("Error al iniciar sesión");
        }
    };

    return (
        <React.Fragment>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Login</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
            <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Raleway:ital@0;1&family=Sacramento&display=swap" rel="stylesheet"></link>
            <link rel="icon" href="images/logo.png" type="image/x-icon"></link>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

            <Header />

            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div id="googleLoginBtn"></div>
            </div>
            
            <Footer />
        </React.Fragment>
    );
}