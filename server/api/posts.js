const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ==================== POST MODEL ====================

const postSchema = new mongoose.Schema({
    author: { type: String, required: true },
    authorEmail: { type: String, required: true },
    authorPicture: { type: String, required: true },
    text: { type: String, required: true },
    userId: { type: String, required: true }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

console.log('📝 Post model loaded successfully');

// ==================== HELPER FUNCTION ====================

// Función para obtener la foto de perfil actual del usuario
async function getUserCurrentPicture(userId) {
    try {
        // Obtener el modelo User de forma dinámica (debe estar ya registrado en server.js)
        const User = mongoose.models.User || mongoose.model('User');
        
        const user = await User.findById(userId);
        if (!user) {
            console.log(`⚠️ User not found: ${userId}`);
            return null;
        }
        
        // Priorizar customPicture sobre picture
        const picture = user.customPicture || user.picture;
        console.log(`📸 User ${userId} picture:`, picture);
        return picture;
    } catch (error) {
        console.error('❌ Error fetching user picture:', error);
        return null;
    }
}

// ==================== ROUTES ====================

// GET - Get all posts
router.get('/', async (req, res) => {
    try {
        console.log('📥 GET /api/posts request - fetching all posts...');
        
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(100);

        console.log(`✅ Posts fetched from MongoDB: ${posts.length} documents`);
        
        if (posts.length > 0) {
            console.log('📄 First post preview:', {
                id: posts[0]._id,
                author: posts[0].author,
                text: posts[0].text.substring(0, 50) + '...'
            });
        }

        // Actualizar fotos de perfil de los autores
        const formattedPosts = await Promise.all(posts.map(async (post) => {
            const currentPicture = await getUserCurrentPicture(post.userId);
            
            return {
                id: post._id.toString(),
                author: post.author,
                authorEmail: post.authorEmail,
                authorPicture: currentPicture || post.authorPicture, // Usar foto actual o la guardada
                text: post.text,
                userId: post.userId,
                date: new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }),
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            };
        }));

        console.log(`📤 Sending ${formattedPosts.length} formatted posts to frontend`);
        res.json(formattedPosts);
    } catch (error) {
        console.error('❌ Error fetching posts:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

// GET - Get posts by user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`📥 GET /api/posts/user/${userId} request - fetching user posts...`);
        
        const posts = await Post.find({ userId }).sort({ createdAt: -1 });
        console.log(`✅ User ${userId} posts fetched: ${posts.length} documents`);

        // Obtener foto actual del usuario
        const currentPicture = await getUserCurrentPicture(userId);

        const formattedPosts = posts.map(post => ({
            id: post._id.toString(),
            author: post.author,
            authorEmail: post.authorEmail,
            authorPicture: currentPicture || post.authorPicture,
            text: post.text,
            userId: post.userId,
            date: new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }));

        console.log(`📤 Sending ${formattedPosts.length} user posts to frontend`);
        res.json(formattedPosts);
    } catch (error) {
        console.error('❌ Error fetching user posts:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Error fetching user posts' });
    }
});

// POST - Create new post
router.post('/', async (req, res) => {
    try {
        console.log('📥 POST /api/posts request - creating new post...');
        console.log('📦 Received data:', {
            author: req.body.author,
            authorEmail: req.body.authorEmail,
            textLength: req.body.text?.length,
            userId: req.body.userId
        });

        const { author, authorEmail, authorPicture, text, userId } = req.body;

        if (!author || !authorEmail || !text || !userId) {
            console.log('❌ Missing required fields', { 
                author: !!author, authorEmail: !!authorEmail, 
                text: !!text, userId: !!userId 
            });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (text.trim().length === 0) {
            console.log('❌ Post text is empty');
            return res.status(400).json({ error: 'Post content cannot be empty' });
        }

        console.log('✅ Data validation passed');

        // Obtener la foto actual del usuario
        const currentPicture = await getUserCurrentPicture(userId);
        const pictureToUse = currentPicture || authorPicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(author);

        console.log('📸 Using picture:', pictureToUse);

        const newPost = new Post({
            author: author.trim(),
            authorEmail: authorEmail.trim(),
            authorPicture: pictureToUse,
            text: text.trim(),
            userId
        });

        console.log('💾 Saving post to MongoDB...');
        await newPost.save();
        console.log('✅ Post saved successfully', { id: newPost._id });

        const formattedPost = {
            id: newPost._id.toString(),
            author: newPost.author,
            authorEmail: newPost.authorEmail,
            authorPicture: newPost.authorPicture,
            text: newPost.text,
            userId: newPost.userId,
            date: new Date(newPost.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }),
            createdAt: newPost.createdAt,
            updatedAt: newPost.updatedAt
        };

        console.log('📤 Sending formatted post to frontend');
        console.log('🎉 Post successfully created by:', author);
        res.status(201).json(formattedPost);
    } catch (error) {
        console.error('❌ Error creating post:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Error creating post', details: error.message });
    }
});

// PUT - Update a post
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text, userId } = req.body;

        console.log(`📥 PUT /api/posts/${id} request - updating post...`);
        console.log('📦 Received data:', { postId: id, userId, newTextLength: text?.length });

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('❌ Invalid post ID:', id);
            return res.status(400).json({ error: 'Invalid post ID' });
        }

        if (!text || text.trim().length === 0) {
            console.log('❌ Post text is empty');
            return res.status(400).json({ error: 'Post content cannot be empty' });
        }

        console.log('🔍 Searching post in MongoDB...');
        const post = await Post.findById(id);

        if (!post) {
            console.log('❌ Post not found');
            return res.status(404).json({ error: 'Post not found' });
        }

        console.log('✅ Post found', { id: post._id, author: post.author });

        if (post.userId !== userId) {
            console.log(`❌ Permission denied: User ${userId} tried to edit post of ${post.userId}`);
            return res.status(403).json({ error: 'Not authorized to edit this post' });
        }

        console.log('✅ User verified as owner');

        const oldText = post.text;
        post.text = text.trim();
        
        console.log('💾 Saving changes to MongoDB...');
        await post.save();
        console.log('✅ Post updated', { oldTextPreview: oldText.substring(0, 30) + '...', newTextPreview: post.text.substring(0, 30) + '...' });

        // Obtener foto actual del usuario
        const currentPicture = await getUserCurrentPicture(post.userId);

        const formattedPost = {
            id: post._id.toString(),
            author: post.author,
            authorEmail: post.authorEmail,
            authorPicture: currentPicture || post.authorPicture,
            text: post.text,
            userId: post.userId,
            date: new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        };

        console.log('📤 Sending updated post to frontend');
        res.json(formattedPost);
    } catch (error) {
        console.error('❌ Error updating post:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Error updating post', details: error.message });
    }
});

// DELETE - Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        console.log(`📥 DELETE /api/posts/${id} request - deleting post...`);
        console.log('📦 Requesting user:', userId);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('❌ Invalid post ID:', id);
            return res.status(400).json({ error: 'Invalid post ID' });
        }

        console.log('🔍 Searching post in MongoDB...');
        const post = await Post.findById(id);

        if (!post) {
            console.log('❌ Post not found');
            return res.status(404).json({ error: 'Post not found' });
        }

        console.log('✅ Post found', { id: post._id, author: post.author });

        if (post.userId !== userId) {
            console.log(`❌ Permission denied: User ${userId} tried to delete post of ${post.userId}`);
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }

        console.log('✅ User verified as owner');
        console.log('🗑️ Deleting post from MongoDB...');
        await Post.findByIdAndDelete(id);
        console.log('✅ Post deleted successfully');

        console.log('📤 Sending deletion confirmation to frontend');
        res.json({ message: 'Post deleted successfully', id });
    } catch (error) {
        console.error('❌ Error deleting post:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Error deleting post', details: error.message });
    }
});

console.log('✅ Post routes loaded successfully');
console.log('📋 Available routes:');
console.log('   GET    /api/posts');
console.log('   GET    /api/posts/user/:userId');
console.log('   POST   /api/posts');
console.log('   PUT    /api/posts/:id');
console.log('   DELETE /api/posts/:id');

module.exports = router;