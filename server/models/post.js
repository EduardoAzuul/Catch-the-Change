const mongoose = require('mongoose');
//schema for post content and its author info in database
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
    timestamps: true // Automatically creates createdAT and updatedAt
});

module.exports = mongoose.model('Post', postSchema);