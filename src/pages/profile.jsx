import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import "../css/profile.css";
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    const API_URL = process.env.REACT_APP_API_URL ||"http://localhost:4000/api";
    const url = API_URL.replace(/\/$/, '');

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleNameEdit = () => {
        setNewName(user.name);
        setIsEditingName(true);
        setError('');
        setSuccess('');
    };

    const handleNameCancel = () => {
        setIsEditingName(false);
        setNewName('');
        setError('');
    };

    const handleNameSave = async () => {
        if (!newName.trim()) {
            setError('Name cannot be empty');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${url}/user/profile/name`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName.trim() })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update name');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditingName(false);
            setSuccess('Name updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating name:', err);
            setError(err.message);
        }
    };

    const handlePictureClick = () => {
        fileInputRef.current?.click();
    };

    const handlePictureChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('picture', file);

            const response = await fetch(`${url}/user/profile/picture`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            // Verificar el content-type de la respuesta
            const contentType = response.headers.get('content-type');
            console.log('Response content-type:', contentType);
            console.log('Response status:', response.status);

            if (!response.ok) {
                const text = await response.text();
                console.error('Error response:', text);
                throw new Error('Failed to upload picture. Check console for details.');
            }

            // Verificar que la respuesta sea JSON
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Expected JSON but got:', text);
                throw new Error('Server returned invalid response');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setSuccess('Profile picture updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error uploading picture:', err);
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handlePictureDelete = async () => {
        if (!window.confirm('Are you sure you want to remove your custom profile picture? It will revert to your Google profile picture.')) {
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${url}/user/profile/picture`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete picture');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setSuccess('Profile picture removed successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error deleting picture:', err);
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (!user) {
        return (
            <React.Fragment>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Profile - Loading</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"></link>
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
                <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Raleway:ital@0;1&family=Sacramento&display=swap" rel="stylesheet"></link>
                <link rel="icon" href="images/logo.png" type="image/x-icon"></link>

                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading profile...</p>
                </div>
            </React.Fragment>
        );
    }

    // Verificar si tiene foto personalizada
    const hasCustomPicture = user.picture && (
        user.picture.includes('/uploads/profiles/') || 
        (user.picture.includes('/images/') && !user.picture.includes('googleusercontent'))
    );

    // Construir URL completa de la imagen
    const getImageUrl = (picturePath) => {
        if (!picturePath) return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=0D8ABC&color=fff&size=150';
        
        // Si es una URL completa (de Google), devolverla tal cual
        if (picturePath.startsWith('http://') || picturePath.startsWith('https://')) {
            return picturePath;
        }
        
        // Si es una ruta relativa, agregar el servidor
        return `${url/picturePath}`;
    };

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
            
            <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
                <div className="card shadow-lg p-4 profile-card text-center" style={{ maxWidth: '500px', width: '100%' }}>
                    
                    {/* Mensajes de error y éxito */}
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {error}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setError('')}
                                aria-label="Close"
                            ></button>
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {success}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setSuccess('')}
                                aria-label="Close"
                            ></button>
                        </div>
                    )}

                    {/* Foto de perfil */}
                    <div className="d-flex justify-content-center position-relative mb-3">
                        <div className="position-relative">
                            <img
                                src={getImageUrl(user.picture)}
                                alt="Profile"
                                className="rounded-circle shadow profile-img"
                                style={{ 
                                    cursor: 'pointer', 
                                    opacity: isUploading ? 0.5 : 1,
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover'
                                }}
                                onClick={handlePictureClick}
                                onError={(e) => {
                                    console.error('Error loading image:', user.picture);
                                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=0D8ABC&color=fff&size=150';
                                }}
                            />
                            {isUploading && (
                                <div className="position-absolute top-50 start-50 translate-middle">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Uploading...</span>
                                    </div>
                                </div>
                            )}
                            <button
                                className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                                onClick={handlePictureClick}
                                disabled={isUploading}
                                style={{ 
                                    width: '40px', 
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem'
                                }}
                                title="Change picture"
                            >
                                📷
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePictureChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {/* Botón para eliminar foto personalizada */}
                    {hasCustomPicture && (
                        <button
                            className="btn btn-sm btn-outline-danger mb-3"
                            onClick={handlePictureDelete}
                            disabled={isUploading}
                        >
                            Remove Custom Picture
                        </button>
                    )}

                    {/* Nombre del usuario */}
                    {!isEditingName ? (
                        <div className="mt-2">
                            <h1 className="fw-bold d-inline-block me-2 mb-0">{user.name}</h1>
                            <button
                                className="btn btn-sm btn-outline-secondary border-0"
                                onClick={handleNameEdit}
                                title="Edit name"
                                style={{ fontSize: '1.2rem' }}
                            >
                                ✏️
                            </button>
                        </div>
                    ) : (
                        <div className="mt-2">
                            <div className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter new name"
                                    autoFocus
                                    maxLength={100}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleNameSave();
                                        } else if (e.key === 'Escape') {
                                            handleNameCancel();
                                        }
                                    }}
                                />
                            </div>
                            <div className="d-flex gap-2 justify-content-center">
                                <button
                                    className="btn btn-sm btn-success px-3"
                                    onClick={handleNameSave}
                                >
                                    Save
                                </button>
                                <button
                                    className="btn btn-sm btn-secondary px-3"
                                    onClick={handleNameCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <p className="text-muted mt-2 mb-0">{user.email}</p>

                    <hr className="my-4" />

                    <button
                        onClick={handleLogout}
                        className="btn btn-danger px-4"
                    >
                        Logout
                    </button>
                </div>
            </div>
            
            <Footer />
        </React.Fragment>
    );
}
