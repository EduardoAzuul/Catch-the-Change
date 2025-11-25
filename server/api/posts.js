const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// ===========================
// GET - Obtener todos los posts
// ===========================
router.get("/", async (req, res) => {
    console.log("📥 [GET] /api/posts — solicitud recibida");

    try {
        const posts = await Post.find().sort({ fechaNum: -1 });

        console.log("📤 [GET] Posts enviados:", posts.length);
        res.json(posts);
    } catch (err) {
        console.error("❌ [GET] Error al obtener posts:", err);
        res.status(500).json({ error: "Error getting posts" });
    }
});

// ===========================
// POST - Crear un nuevo post
// ===========================
router.post("/", async (req, res) => {
    console.log("📥 [POST] /api/posts — Body recibido:");
    console.log(req.body);

    if (!req.body.texto || !req.body.nombre) {
        console.error("❌ [POST] Datos incompletos:", req.body);
    }

    try {
        const nuevoPost = new Post({
            nombre: req.body.nombre,
            email: req.body.email,
            picture: req.body.picture,
            userId: req.body.userId,
            texto: req.body.texto,
            fecha: req.body.fecha,
            fechaNum: Date.now(),
        });

        console.log("📝 [POST] Guardando post en Mongo:", nuevoPost);

        const savedPost = await nuevoPost.save();

        console.log("✅ [POST] Post guardado correctamente:", savedPost);
        res.json(savedPost);
    } catch (err) {
        console.error("❌ [POST] Error al guardar post:", err);
        res.status(500).json({ error: "Error saving post" });
    }
});

// ===========================
// PUT - Editar un post
// ===========================
router.put("/:id", async (req, res) => {
    console.log(`📥 [PUT] /api/posts/${req.params.id}`);
    console.log("Nuevo texto recibido:", req.body.texto);

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { texto: req.body.texto },
            { new: true }
        );

        console.log("✏️ [PUT] Post actualizado:", updatedPost);
        res.json(updatedPost);
    } catch (err) {
        console.error("❌ [PUT] Error al actualizar post:", err);
        res.status(500).json({ error: "Error updating post" });
    }
});

// ===========================
// DELETE - Eliminar un post
// ===========================
router.delete("/:id", async (req, res) => {
    console.log(`📥 [DELETE] /api/posts/${req.params.id}`);

    try {
        await Post.findByIdAndDelete(req.params.id);
        console.log("🗑️ [DELETE] Post eliminado correctamente");
        res.json({ message: "Post deleted" });
    } catch (err) {
        console.error("❌ [DELETE] Error al eliminar post:", err);
        res.status(500).json({ error: "Error deleting post" });
    }
});

module.exports = router;
