const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ==================== MODELO DE POST ====================

const postSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    authorPicture: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Crea automáticamente createdAt y updatedAt
});

const Post = mongoose.model('Post', postSchema);

console.log('📝 Modelo Post cargado correctamente');

// ==================== RUTAS ====================

// GET - Obtener todos los posts
router.get('/', async (req, res) => {
    try {
        console.log('📥 Petición GET /api/posts - Obteniendo todos los posts...');
        
        const posts = await Post.find()
            .sort({ createdAt: -1 }) // Más recientes primero
            .limit(100); // Limitar a 100 posts

        console.log(`✅ Posts obtenidos de MongoDB: ${posts.length} documentos`);
        
        if (posts.length > 0) {
            console.log('📄 Primer post:', {
                id: posts[0]._id,
                author: posts[0].author,
                text: posts[0].text.substring(0, 50) + '...'
            });
        }

        // Formatear la fecha para el frontend
        const formattedPosts = posts.map(post => ({
            id: post._id.toString(),
            author: post.author,
            authorEmail: post.authorEmail,
            authorPicture: post.authorPicture,
            text: post.text,
            userId: post.userId,
            date: new Date(post.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }));

        console.log(`📤 Enviando ${formattedPosts.length} posts formateados al frontend`);
        res.json(formattedPosts);
    } catch (error) {
        console.error('❌ Error al obtener posts:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Error al obtener los posts' });
    }
});

// GET - Obtener posts de un usuario específico
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`📥 Petición GET /api/posts/user/${userId} - Obteniendo posts del usuario...`);
        
        const posts = await Post.find({ userId })
            .sort({ createdAt: -1 });

        console.log(`✅ Posts del usuario ${userId} obtenidos de MongoDB: ${posts.length} documentos`);

        const formattedPosts = posts.map(post => ({
            id: post._id.toString(),
            author: post.author,
            authorEmail: post.authorEmail,
            authorPicture: post.authorPicture,
            text: post.text,
            userId: post.userId,
            date: new Date(post.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }));

        console.log(`📤 Enviando ${formattedPosts.length} posts del usuario al frontend`);
        res.json(formattedPosts);
    } catch (error) {
        console.error('❌ Error al obtener posts del usuario:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Error al obtener los posts del usuario' });
    }
});

// POST - Crear un nuevo post
router.post('/', async (req, res) => {
    try {
        console.log('📥 Petición POST /api/posts - Creando nuevo post...');
        console.log('📦 Datos recibidos:', {
            author: req.body.author,
            authorEmail: req.body.authorEmail,
            textLength: req.body.text?.length,
            userId: req.body.userId
        });

        const { author, authorEmail, authorPicture, text, userId } = req.body;

        // Validación
        if (!author || !authorEmail || !authorPicture || !text || !userId) {
            console.log('❌ Faltan campos requeridos');
            console.log('Campos recibidos:', { 
                author: !!author, 
                authorEmail: !!authorEmail, 
                authorPicture: !!authorPicture, 
                text: !!text, 
                userId: !!userId 
            });
            return res.status(400).json({ 
                error: 'Faltan campos requeridos',
                received: { author, authorEmail, authorPicture, text, userId }
            });
        }

        if (text.trim().length === 0) {
            console.log('❌ El texto del post está vacío');
            return res.status(400).json({ 
                error: 'El contenido del post no puede estar vacío' 
            });
        }

        console.log('✅ Validación de datos completada');

        // Crear el post
        const newPost = new Post({
            author: author.trim(),
            authorEmail: authorEmail.trim(),
            authorPicture,
            text: text.trim(),
            userId
        });

        console.log('💾 Guardando post en MongoDB...');
        await newPost.save();
        console.log('✅ Post guardado exitosamente en MongoDB');
        console.log('📄 ID del post:', newPost._id.toString());
        console.log('📄 Detalles del post guardado:', {
            id: newPost._id,
            author: newPost.author,
            authorEmail: newPost.authorEmail,
            textPreview: newPost.text.substring(0, 50) + (newPost.text.length > 50 ? '...' : ''),
            userId: newPost.userId,
            createdAt: newPost.createdAt
        });

        // Verificar que se guardó en la base de datos
        const verifyPost = await Post.findById(newPost._id);
        if (verifyPost) {
            console.log('✅ Verificación: Post encontrado en MongoDB después de guardar');
        } else {
            console.log('⚠️ Advertencia: Post no encontrado en MongoDB después de guardar');
        }

        // Devolver el post formateado
        const formattedPost = {
            id: newPost._id.toString(),
            author: newPost.author,
            authorEmail: newPost.authorEmail,
            authorPicture: newPost.authorPicture,
            text: newPost.text,
            userId: newPost.userId,
            date: new Date(newPost.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            createdAt: newPost.createdAt,
            updatedAt: newPost.updatedAt
        };

        console.log('📤 Enviando post formateado al frontend');
        console.log('🎉 Post creado exitosamente por:', author);
        res.status(201).json(formattedPost);
    } catch (error) {
        console.error('❌ Error al crear post:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: 'Error al crear el post',
            details: error.message 
        });
    }
});

// PUT - Actualizar un post
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text, userId } = req.body;

        console.log(`📥 Petición PUT /api/posts/${id} - Actualizando post...`);
        console.log('📦 Datos recibidos:', {
            postId: id,
            userId: userId,
            newTextLength: text?.length
        });

        // Validar ID de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('❌ ID de post inválido:', id);
            return res.status(400).json({ error: 'ID de post inválido' });
        }

        // Validación
        if (!text || text.trim().length === 0) {
            console.log('❌ El texto del post está vacío');
            return res.status(400).json({ 
                error: 'El contenido del post no puede estar vacío' 
            });
        }

        console.log('🔍 Buscando post en MongoDB...');
        // Buscar el post
        const post = await Post.findById(id);

        if (!post) {
            console.log('❌ Post no encontrado en MongoDB');
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        console.log('✅ Post encontrado en MongoDB');
        console.log('📄 Post actual:', {
            id: post._id,
            author: post.author,
            userId: post.userId
        });

        // Verificar que el usuario sea el propietario
        if (post.userId !== userId) {
            console.log(`❌ Permiso denegado: Usuario ${userId} intentó editar post de ${post.userId}`);
            return res.status(403).json({ 
                error: 'No tienes permiso para editar este post' 
            });
        }

        console.log('✅ Usuario verificado como propietario');

        // Actualizar
        const oldText = post.text;
        post.text = text.trim();
        
        console.log('💾 Guardando cambios en MongoDB...');
        await post.save();
        console.log('✅ Post actualizado exitosamente en MongoDB');
        console.log('📝 Cambio realizado:', {
            oldTextPreview: oldText.substring(0, 30) + '...',
            newTextPreview: post.text.substring(0, 30) + '...'
        });

        const formattedPost = {
            id: post._id.toString(),
            author: post.author,
            authorEmail: post.authorEmail,
            authorPicture: post.authorPicture,
            text: post.text,
            userId: post.userId,
            date: new Date(post.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        };

        console.log(`📤 Enviando post actualizado al frontend`);
        res.json(formattedPost);
    } catch (error) {
        console.error('❌ Error al actualizar post:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: 'Error al actualizar el post',
            details: error.message 
        });
    }
});

// DELETE - Eliminar un post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        console.log(`📥 Petición DELETE /api/posts/${id} - Eliminando post...`);
        console.log('📦 Usuario solicitante:', userId);

        // Validar ID de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('❌ ID de post inválido:', id);
            return res.status(400).json({ error: 'ID de post inválido' });
        }

        console.log('🔍 Buscando post en MongoDB...');
        // Buscar el post
        const post = await Post.findById(id);

        if (!post) {
            console.log('❌ Post no encontrado en MongoDB');
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        console.log('✅ Post encontrado en MongoDB');
        console.log('📄 Post a eliminar:', {
            id: post._id,
            author: post.author,
            userId: post.userId,
            textPreview: post.text.substring(0, 30) + '...'
        });

        // Verificar que el usuario sea el propietario
        if (post.userId !== userId) {
            console.log(`❌ Permiso denegado: Usuario ${userId} intentó eliminar post de ${post.userId}`);
            return res.status(403).json({ 
                error: 'No tienes permiso para eliminar este post' 
            });
        }

        console.log('✅ Usuario verificado como propietario');
        console.log('🗑️ Eliminando post de MongoDB...');
        
        await Post.findByIdAndDelete(id);
        
        console.log('✅ Post eliminado exitosamente de MongoDB');
        
        // Verificar que se eliminó
        const verifyDeleted = await Post.findById(id);
        if (!verifyDeleted) {
            console.log('✅ Verificación: Post ya no existe en MongoDB');
        } else {
            console.log('⚠️ Advertencia: Post todavía existe en MongoDB después de eliminarlo');
        }

        console.log(`📤 Confirmación de eliminación enviada al frontend`);
        res.json({ 
            message: 'Post eliminado exitosamente', 
            id 
        });
    } catch (error) {
        console.error('❌ Error al eliminar post:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: 'Error al eliminar el post',
            details: error.message 
        });
    }
});

// Log al cargar el módulo
console.log('✅ Rutas de posts cargadas correctamente');
console.log('📋 Rutas disponibles:');
console.log('   GET    /api/posts');
console.log('   GET    /api/posts/user/:userId');
console.log('   POST   /api/posts');
console.log('   PUT    /api/posts/:id');
console.log('   DELETE /api/posts/:id');

module.exports = router;