const mongoose = require('mongoose');

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
    timestamps: true // Esto crea automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Post', postSchema);