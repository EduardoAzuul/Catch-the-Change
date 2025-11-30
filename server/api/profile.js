// server/api/profile.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../public/uploads/profiles');
        if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB límite
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
        return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
});

// Middleware para verificar token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// GET - Obtener perfil del usuario
router.get('/', verifyToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        const user = await db.get('SELECT id, name, email, picture FROM users WHERE id = ?', [req.userId]);
        
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT - Actualizar nombre del usuario
router.put('/name', verifyToken, async (req, res) => {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
        return res.status(400).json({ message: 'Name is required' });
    }
    
    if (name.length > 100) {
        return res.status(400).json({ message: 'Name is too long' });
    }
    
    try {
        const db = req.app.get('db');
        await db.run('UPDATE users SET name = ? WHERE id = ?', [name.trim(), req.userId]);
        
        const updatedUser = await db.get('SELECT id, name, email, picture FROM users WHERE id = ?', [req.userId]);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating name:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT - Actualizar foto de perfil
router.put('/picture', verifyToken, upload.single('picture'), async (req, res) => {
    try {
        if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
        }
        
        const db = req.app.get('db');
        
        // Obtener la foto anterior para eliminarla
        const user = await db.get('SELECT picture FROM users WHERE id = ?', [req.userId]);
        
        // Eliminar foto anterior si existe y no es la default
        if (user.picture && !user.picture.includes('default-avatar.png')) {
        const oldPicturePath = path.join(__dirname, '../public', user.picture.replace(/^\//, ''));
        if (fs.existsSync(oldPicturePath)) {
            fs.unlinkSync(oldPicturePath);
        }
        }
        
        // Guardar nueva foto
        const pictureUrl = `/uploads/profiles/${req.file.filename}`;
        await db.run('UPDATE users SET picture = ? WHERE id = ?', [pictureUrl, req.userId]);
        
        const updatedUser = await db.get('SELECT id, name, email, picture FROM users WHERE id = ?', [req.userId]);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating picture:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE - Eliminar foto de perfil (volver a default)
router.delete('/picture', verifyToken, async (req, res) => {
    try {
        const db = req.app.get('db');
        
        // Obtener la foto actual
        const user = await db.get('SELECT picture FROM users WHERE id = ?', [req.userId]);
        
        // Eliminar foto si existe y no es la default
        if (user.picture && !user.picture.includes('default-avatar.png')) {
        const picturePath = path.join(__dirname, '../public', user.picture.replace(/^\//, ''));
        if (fs.existsSync(picturePath)) {
            fs.unlinkSync(picturePath);
        }
        }
        
        // Restaurar a foto default
        const defaultPicture = '/images/default-avatar.png';
        await db.run('UPDATE users SET picture = ? WHERE id = ?', [defaultPicture, req.userId]);
        
        const updatedUser = await db.get('SELECT id, name, email, picture FROM users WHERE id = ?', [req.userId]);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error deleting picture:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;