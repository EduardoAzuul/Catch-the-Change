import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../js/AuthContext';

import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/post.css'; 

const API_URL = process.env.REACT_APP_API_URL ||"http://localhost:4000/api";


// --- COMPONENTE PRINCIPAL (Posts) ---
const Posts = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    
    
    // Verificar que el usuario esté autenticado
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Cargar posts al montar el componente
    useEffect(() => {
        if (user) {
            fetchPosts();
        }
    }, [user]);

    // Si no hay usuario, no renderizar nada
    if (!user) {
        return null;
    }

    // Función para obtener todos los posts desde MongoDB
    const fetchPosts = async () => {
        try {
            console.log('🔄 Obteniendo posts desde el servidor...');
            setLoading(true);
            const response = await fetch(`${API_URL}/posts`);
            
            if (!response.ok) {
                throw new Error('Error al cargar los posts');
            }
            
            const data = await response.json();
            console.log('✅ Posts recibidos del servidor:', data.length);
            setPosts(data);
        } catch (err) {
            console.error('❌ Error al obtener posts:', err);
            setError('Error al cargar los posts');
        } finally {
            setLoading(false);
        }
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
        if (error) setError(null);
    };

    // Crear nuevo post y guardarlo en MongoDB
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Por favor, ingresa el contenido del post.');
            return;
        }

        try {
            console.log('📤 Enviando nuevo post al servidor...');
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    author: user.name,
                    authorEmail: user.email,
                    authorPicture: user.picture,
                    text: content.trim(),
                    userId: user.email
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear el post');
            }

            const newPost = await response.json();
            console.log('✅ Post creado exitosamente:', newPost.id);
            
            setPosts(prevPosts => [newPost, ...prevPosts]);
            setContent('');
            setError(null);
        } catch (err) {
            console.error('❌ Error al crear post:', err);
            setError(err.message || 'Error al publicar el post');
        }
    };

    // Componente para cada post individual
    const PostItem = ({ post }) => {
        const isOwner = post.authorEmail === user.email;
        const [isEditing, setIsEditing] = useState(false);
        const [editText, setEditText] = useState(post.text);
        const [editError, setEditError] = useState(null);

        // Actualizar post en MongoDB
        const handleSave = async () => {
            if (!editText.trim()) {
                setEditError('El contenido del post no puede estar vacío.');
                return;
            }
            
            try {
                console.log('📤 Actualizando post en el servidor...');
                const response = await fetch(`${API_URL}/posts/${post.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: editText.trim(),
                        userId: user.email
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al actualizar el post');
                }

                const updatedPost = await response.json();
                console.log('✅ Post actualizado exitosamente:', updatedPost.id);
                
                setPosts(prevPosts => 
                    prevPosts.map(p => 
                        p.id === post.id ? updatedPost : p
                    )
                );
                
                setIsEditing(false);
                setEditError(null);
            } catch (err) {
                console.error('❌ Error al actualizar post:', err);
                setEditError(err.message || 'Error al actualizar el post');
            }
        };

        // Eliminar post de MongoDB
        const handleDelete = async () => {
            if (!window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
                return;
            }

            try {
                console.log('📤 Eliminando post del servidor...');
                const response = await fetch(`${API_URL}/posts/${post.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: user.email
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al eliminar el post');
                }

                console.log('✅ Post eliminado exitosamente:', post.id);
                setPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
            } catch (err) {
                console.error('❌ Error al eliminar post:', err);
                alert(err.message || 'Error al eliminar el post');
            }
        };

        return (
            <div className="card shadow-sm border-start border-5 border-success h-100">
                <div className="card-body p-4">
                    {editError && (
                        <div className="alert alert-danger mb-3" role="alert">
                            <strong>Error:</strong> {editError}
                        </div>
                    )}
                    
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                            <img 
                                src={post.authorPicture} 
                                alt={post.author}
                                className="rounded-circle me-2"
                                style={{ width: '40px', height: '40px' }}
                            />
                            <div>
                                <h5 className="mb-0 text-success">
                                    {post.author}
                                    {isOwner && (
                                        <span className="badge bg-primary ms-2" style={{ fontSize: '0.7rem' }}>
                                            Tú
                                        </span>
                                    )}
                                </h5>
                                <small className="text-muted">{post.authorEmail}</small>
                            </div>
                        </div>
                        
                        <span className="text-muted small">
                            <i className="far fa-calendar-alt me-1"></i>
                            {post.date}
                        </span>
                    </div>
                    
                    {isEditing ? (
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="form-control mb-3"
                            rows="4"
                        />
                    ) : (
                        <p className="card-text text-dark mt-3" style={{ whiteSpace: 'pre-wrap' }}>
                            {post.text}
                        </p>
                    )}

                    {isOwner && (
                        <div className="mt-3 pt-3 border-top d-flex justify-content-end gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="btn btn-success btn-sm"
                                    >
                                        <i className="fas fa-check me-1"></i> Guardar
                                    </button>
                                    <button
                                        onClick={() => { 
                                            setIsEditing(false); 
                                            setEditText(post.text); 
                                            setEditError(null); 
                                        }}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        <i className="fas fa-times me-1"></i> Cancelar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn btn-primary btn-sm"
                                    >
                                        <i className="fas fa-edit me-1"></i> Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="btn btn-danger btn-sm"
                                    >
                                        <i className="fas fa-trash-alt me-1"></i> Delete
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Mostrar loading mientras carga
    if (loading) {
        return (
            <div className="bg-light min-vh-100">
                <Header />
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Posts</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
            <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Raleway:ital@0;1&family=Sacramento&display=swap" rel="stylesheet"></link>
            <link rel="icon" href="images/logo.png" type="image/x-icon"></link>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            <Header />

            <section id="home" className="hero">
                <video id="heroVideo" className="hero-media" autoPlay muted loop playsInline poster="Images/HeroImages/posts.jpg"></video>
                <div className="hero-overlay container text-center">
                    <h1 className="hero-title">Community posts</h1>
                    <p className="hero-sublead">Tell your story and connect with others</p>
                </div>
            </section>
            <div className="container-md pt-4 pb-5">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-primary">
                    <div className="d-flex align-items-center">
                        <img 
                            src={user.picture} 
                            alt={user.name}
                            className="rounded-circle me-2"
                            style={{ width: '50px', height: '50px' }}
                        />
                        <div>
                            <div className="fw-bold">{user.name}</div>
                            <small className="text-muted">{user.email}</small>
                        </div>
                    </div>
                </div>

                {/* Formulario de Nueva Publicación */}
                <section id="form-section" className="card shadow-lg mb-5 border-top border-5 border-primary">
                    <div className="card-body p-4 p-md-5">
                        <h2 className="card-title h4 text-secondary mb-4">
                            <i className="fas fa-feather-alt me-2 text-primary"></i>
                            Create a New Post
                        </h2>
                        
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    Publishing as:
                                </label>
                                <div className="d-flex align-items-center p-3 bg-light rounded">
                                    <img 
                                        src={user.picture} 
                                        alt={user.name}
                                        className="rounded-circle me-2"
                                        style={{ width: '40px', height: '40px' }}
                                    />
                                    <div>
                                        <div className="fw-bold text-primary">{user.name}</div>
                                        <small className="text-muted">{user.email}</small>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">
                                    Content:
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={content}
                                    onChange={handleContentChange}
                                    rows="4"
                                    className="form-control"
                                    placeholder="What are you thinking?"
                                    required
                                ></textarea>
                            </div>
                            
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg shadow"
                                >
                                    <i className="fas fa-paper-plane me-2"></i>
                                    Publish
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                
                
                {posts.length === 0 ? (
                    <div className="text-center p-5 bg-white rounded shadow-sm text-muted">
                        There are no posts yet. Be the first to create one!
                    </div>
                ) : (
                    <div className="row g-4">
                        {posts.map((post) => (
                            <div key={post.id} className="col-12">
                                <PostItem post={post} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
};

export default Posts;