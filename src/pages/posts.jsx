import { useState, useEffect } from 'react';

import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';


import '../css/post.css'; 
import scrollFade from '../js/scrollFade.js';

export default function ComentariosApp() {
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [googleLoaded, setGoogleLoaded] = useState(false);

    // =======================================================
    // FUNCIÓN CRÍTICA: MANEJA LA RESPUESTA DE GOOGLE SIGN-IN
    // =======================================================
    const handleCredentialResponse = (response) => {
        console.log("Credenciales recibidas. Procesando...");
        const token = response.credential;
        // Intenta decodificar el token para obtener los datos del usuario
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            const userData = {
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                sub: payload.sub // Identificador único de Google
            };

            // *** ESTO ES LO CRÍTICO: Actualiza el estado y fuerza el re-renderizado ***
            setUser(userData); 
            sessionStorage.setItem('user', JSON.stringify(userData));
            console.log("Usuario logueado y estado actualizado.");
        } catch (error) {
            console.error("Error al decodificar el token de Google:", error);
            setUser(null);
        }
    };

    const signOut = () => {
        if (window.google) {
            // Deshabilita la selección automática para el próximo inicio
            window.google.accounts.id.disableAutoSelect();
        }
        setUser(null);
        sessionStorage.removeItem('user');
        setComentarios([]); // Opcional: limpiar comentarios en el logout
    };

    // Efecto para cargar el script de Google y su inicialización
    useEffect(() => {
        const initGoogleAuth = () => {
            if (window.google) {
                // ** IMPORTANTE: Reemplaza 'YOUR_CLIENT_ID' con tu ID real de Google **
                const CLIENT_ID = '506755432338-pn9so2lvkvlsjru9dq065e7vfnf29iur.apps.googleusercontent.com'; 
                
                if (CLIENT_ID === 'YOUR_CLIENT_ID') {
                    console.error("ADVERTENCIA: Debes reemplazar 'YOUR_CLIENT_ID' con tu ID de cliente real.");
                    setIsLoading(false);
                    return;
                }

                window.google.accounts.id.initialize({
                    client_id: CLIENT_ID,
                    callback: handleCredentialResponse,
                });

                setGoogleLoaded(true);
            }
            setIsLoading(false);
        };

        // Comprobación para evitar cargar el script múltiples veces
        if (!window.google) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initGoogleAuth;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        } else {
            initGoogleAuth();
        }
    }, []);

    // Efecto para renderizar el botón de Google
    useEffect(() => {
        const buttonElement = document.getElementById('googleSignInButton');

        if (googleLoaded && !user && buttonElement && window.google) {
            // Renderiza el botón solo si el usuario NO está logueado
            window.google.accounts.id.renderButton(
                buttonElement,
                {
                    theme: 'outline',
                    size: 'large',
                    width: 300,
                    text: 'signin_with'
                }
            );
            // Esto es opcional, puede forzar una ventana de "logueo automático"
            // window.google.accounts.id.prompt(); 
        }
    }, [googleLoaded, user]);

    // Efecto para cargar comentarios y usuario desde sessionStorage (persistencia)
    useEffect(() => {
        const savedComments = sessionStorage.getItem('comentarios');
        if (savedComments) {
            setComentarios(JSON.parse(savedComments));
        }

        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Efecto para guardar comentarios en sessionStorage
    useEffect(() => {
        if (comentarios.length > 0 || sessionStorage.getItem('comentarios')) {
            sessionStorage.setItem('comentarios', JSON.stringify(comentarios));
        }
    }, [comentarios]);

    const agregarComentario = () => {
        if (!nuevoComentario.trim()) return;

        const comentario = {
            id: Date.now(),
            nombre: user.name,
            email: user.email,
            picture: user.picture,
            userId: user.sub,
            texto: nuevoComentario,
            fecha: new Date().toLocaleString()
        };

        setComentarios([comentario, ...comentarios]);
        setNuevoComentario('');
    };

    const eliminarComentario = (id) => {
        setComentarios(comentarios.filter(c => c.id !== id));
    };

    const startEditing = (comment) => {
        setEditingId(comment.id);
        setEditingText(comment.texto);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingText('');
    };

    const saveEdit = (id) => {
        setComentarios(comentarios.map(c =>
            c.id === id ? { ...c, texto: editingText } : c
        ));
        cancelEditing();
    };


    /* =======================================================
       RENDERIZADO CONDICIONAL
       ======================================================= */

    if (isLoading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted fs-5">Cargando...</p>
                </div>
            </div>
        );
    }
    
    // Vista de NO LOGUEADO
    if (!user) {
        return (
            <>
                <Header />



                <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'var(--azul-intermedio)' }}>
                    <div className="card shadow-lg border-0 auth-card" style={{ maxWidth: '400px' }}>
                        <div className="card-body p-5 text-center">
                            <div className="mb-4">
                                <p className="text-muted">Log in with google</p>
                            </div>
                            <div className="d-flex justify-content-center mb-4">
                                <div id="googleSignInButton"></div>
                            </div>
                            <div className="mt-4 pt-3 border-top">
                                <p className="small text-muted mb-0">
                                    We use Google sign-in in to keep your information secure
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
    
    // Vista de LOGUEADO
    return (
        <>
            <Header />

            <div className="main-bg py-5" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10 col-xl-8">

                            {/* Tarjeta de Usuario */}
                            <div className="card border-0 shadow-sm mb-4 user-card">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <img
                                                src={user.picture}
                                                alt={user.name}
                                                className="rounded-circle"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                            />
                                            <div>
                                                <h5 className="mb-1 fw-bold" style={{ color: 'var(--azul-oscuro)' }}>{user.name}</h5>
                                                <p className="mb-0 text-muted small">{user.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={signOut} className="btn btn-outline-danger rounded-pill px-4">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Título de la Sección de Comentarios */}
                            <div className="text-center mb-5">
                                <h2 className="mh2">Coments</h2>
                                <p className="text-muted">Join Conversation</p>
                            </div>

                            {/* Tarjeta para Agregar Comentario */}
                            <div className="card border-0 shadow-sm mb-5 comment-form-card" style={{ backgroundColor: 'var(--azul-claro)' }}>
                                <div className="card-body p-4">
                                    <h5 className="card-title fw-bold mb-3" style={{ color: 'var(--azul-secundario)' }}>Add Comment</h5>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">
                                            Commenting as: <strong style={{ color: 'var(--azul-oscuro)' }}>{user.name}</strong>
                                        </label>
                                        <textarea
                                            value={nuevoComentario}
                                            onChange={(e) => setNuevoComentario(e.target.value)}
                                            className="form-control border-2"
                                            rows="4"
                                            placeholder="Write your comment here..."
                                        />
                                    </div>
                                    <button
                                        onClick={agregarComentario}
                                        disabled={!nuevoComentario.trim()}
                                        className="btn w-100 py-2 rounded-pill fw-bold"
                                        style={{ backgroundColor: 'var(--azul-secundario)', color: 'white' }}
                                    >
                                        Publicar Comentario
                                    </button>
                                </div>
                            </div>

                            {/* Lista de Comentarios */}
                            <div>
                                <h4 className="fw-bold mb-4" style={{ color: 'var(--azul-intermedio)' }}>
                                    {comentarios.length === 0 ? 'Sin comentarios aún' : `${comentarios.length} ${comentarios.length === 1 ? 'Comentario' : 'Comentarios'}`}
                                </h4>

                                {comentarios.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p className="text-muted fs-5 mt-3">¡Be the first to comment!</p>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {comentarios.map((comentario) => (
                                            <div key={comentario.id} className="card border-0 shadow-sm comment-card">
                                                <div className="card-body p-4">
                                                    {editingId === comentario.id ? (
                                                        <div>
                                                            <textarea
                                                                value={editingText}
                                                                onChange={(e) => setEditingText(e.target.value)}
                                                                className="form-control border-2"
                                                                rows="3"
                                                            />
                                                            <div className="d-flex gap-2 mt-3">
                                                                <button onClick={() => saveEdit(comentario.id)} className="btn btn-success flex-fill rounded-pill">Guardar</button>
                                                                <button onClick={cancelEditing} className="btn btn-secondary flex-fill rounded-pill">Cancelar</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <img
                                                                        src={comentario.picture}
                                                                        alt={comentario.nombre}
                                                                        className="rounded-circle"
                                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                    />
                                                                    <div>
                                                                        <h6 className="mb-0 fw-bold" style={{ color: 'var(--azul-intermedio)' }}>{comentario.nombre}</h6>
                                                                        <small className="text-muted">{comentario.fecha}</small>
                                                                    </div>
                                                                </div>

                                                                {comentario.userId === user.sub && (
                                                                    <div className="d-flex gap-2">
                                                                        <button onClick={() => startEditing(comentario)} className="btn btn-sm btn-outline-primary rounded-circle">Edit</button>
                                                                        <button onClick={() => eliminarComentario(comentario.id)} className="btn btn-sm btn-outline-danger rounded-circle">Remove</button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <p className="mb-0 text-dark">{comentario.texto}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}