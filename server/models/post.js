const mongoose = require("mongoose");

console.log("[Model] Cargando modelo Post...");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Debug para verificar que el modelo se compila correctamente
console.log("[Model] Compilando modelo Post en Mongoose...");

const Post = mongoose.model("Post", PostSchema);

console.log("[Model] Modelo Post cargado exitosamente.");

module.exports = Post;
