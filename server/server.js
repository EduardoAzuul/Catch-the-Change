const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { getMarkers } = require("./api/markers");
const { getEconomicZone } = require("./api/economicZoneLayer");
const { getProtectedAreas1 } = require("./api/protectedAreas1Layer");
const { getProtectedAreas2 } = require("./api/protectedAreas2Layer");
const postsRoutes = require("./api/posts");
const contactUsRoutes = require("./api/contactUs");

const app = express();
const PORT = process.env.PORT || 4000;

// ==================== MULTER CONFIGURATION ====================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, "public/uploads/profiles");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif, webp)"));
    },
});

// ==================== GOOGLE OAUTH VALIDATOR ====================

const googleClient = new OAuth2Client(process.env.MY_ID_GOOGLE);

// ==================== CORS ====================

app.use(
    cors({
        origin: "*",
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type, Authorization",
    })
);

app.use((req, res, next) => {
    console.log(`➡️  Request: ${req.method} ${req.url}`);
    next();
});

app.use(express.json());

// Servir archivos estáticos (para fotos de perfil)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, "public")));

// ==================== MONGODB MODELS ====================

console.log("🧪 Cargando modelos de MongoDB...");

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String, default: "/images/default-avatar.png" },
    customPicture: { type: String }, // Para fotos subidas por el usuario
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    texto: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    editedAt: Date,
});
const Comment = mongoose.model("Comment", commentSchema);

// ==================== JWT AUTH MIDDLEWARE ====================

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
        return res.status(401).json({ error: "Token no proporcionado" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token inválido" });

        req.user = user;
        next();
    });
};

// ==================== GOOGLE AUTH ====================

app.post("/api/auth/google", async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        let user = await User.findOne({ googleId: sub });

        if (user) {
            user.lastLogin = new Date();
            // Solo actualizar picture de Google si no tiene foto personalizada
            if (!user.customPicture) {
                user.picture = picture;
            }
            await user.save();
        } else {
            user = await User.create({
                googleId: sub,
                email,
                name,
                picture, // Foto de Google por defecto
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Devolver customPicture si existe, sino picture de Google
        const profilePicture = user.customPicture || user.picture;

        res.json({
            token,
            user: {
                id: user._id,
                googleId: user.googleId,
                name: user.name,
                email: user.email,
                picture: profilePicture,
            },
        });
    } catch (error) {
        console.error("❌ Error en autenticación Google:", error);
        res.status(500).json({
            error: "Error validando token Google",
            details: error.message,
        });
    }
});

// ==================== USER PROFILE ====================

app.get("/api/user/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-__v");
        if (!user)
            return res.status(404).json({ error: "Usuario no encontrado" });

        res.json({
            id: user._id,
            googleId: user.googleId,
            name: user.name,
            email: user.email,
            picture: user.customPicture || user.picture,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error en el servidor",
            details: error.message,
        });
    }
});

// PUT - Actualizar nombre
app.put("/api/user/profile/name", authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: "Name is required" });
        }

        if (name.length > 100) {
            return res.status(400).json({ error: "Name is too long" });
        }

        const user = await User.findById(req.user.userId);
        if (!user)
            return res.status(404).json({ error: "Usuario no encontrado" });

        user.name = name.trim();
        await user.save();

        res.json({
            id: user._id,
            googleId: user.googleId,
            name: user.name,
            email: user.email,
            picture: user.customPicture || user.picture,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error en el servidor",
            details: error.message,
        });
    }
});

// PUT - Actualizar foto de perfil
app.put(
    "/api/user/profile/picture",
    authenticateToken,
    (req, res, next) => {
        console.log('📸 Picture upload request received');
        console.log('User ID:', req.user.userId);
        next();
    },
    upload.single("picture"),
    async (req, res) => {
        try {
            console.log('📸 File received:', req.file);
            
            if (!req.file) {
                console.error('❌ No file in request');
                return res.status(400).json({ error: "No file uploaded" });
            }

            const user = await User.findById(req.user.userId);
            if (!user) {
                console.error('❌ User not found:', req.user.userId);
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            console.log('👤 Current user:', { id: user._id, email: user.email });

            // Eliminar foto anterior si existe
            if (user.customPicture) {
                const oldPicturePath = path.join(
                    __dirname,
                    "public",
                    user.customPicture.replace(/^\//, "")
                );
                console.log('🗑️ Deleting old picture:', oldPicturePath);
                if (fs.existsSync(oldPicturePath)) {
                    fs.unlinkSync(oldPicturePath);
                    console.log('✅ Old picture deleted');
                }
            }

            // Guardar nueva foto
            const pictureUrl = `/uploads/profiles/${req.file.filename}`;
            console.log('💾 Saving new picture URL:', pictureUrl);
            
            user.customPicture = pictureUrl;
            await user.save();

            console.log('✅ Picture updated successfully');

            const responseData = {
                id: user._id,
                googleId: user.googleId,
                name: user.name,
                email: user.email,
                picture: user.customPicture,
            };

            console.log('📤 Sending response:', responseData);
            res.json(responseData);
        } catch (error) {
            console.error("❌ Error updating picture:", error);
            res.status(500).json({
                error: "Error updating picture",
                details: error.message,
            });
        }
    }
);

// DELETE - Eliminar foto personalizada (volver a Google)
app.delete("/api/user/profile/picture", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user)
            return res.status(404).json({ error: "Usuario no encontrado" });

        // Eliminar foto personalizada si existe
        if (user.customPicture) {
            const picturePath = path.join(
                __dirname,
                "public",
                user.customPicture.replace(/^\//, "")
            );
            if (fs.existsSync(picturePath)) {
                fs.unlinkSync(picturePath);
            }
            user.customPicture = null;
            await user.save();
        }

        res.json({
            id: user._id,
            googleId: user.googleId,
            name: user.name,
            email: user.email,
            picture: user.picture, // Vuelve a la foto de Google
        });
    } catch (error) {
        console.error("❌ Error deleting picture:", error);
        res.status(500).json({
            error: "Error deleting picture",
            details: error.message,
        });
    }
});

// ==================== OTHER ROUTES ====================

app.get("/api/markers", getMarkers);
app.get("/api/economicZoneLayer", getEconomicZone);
app.get("/api/protectedAreas1Layer", getProtectedAreas1);
app.get("/api/protectedAreas2Layer", getProtectedAreas2);
app.use("/api/posts", postsRoutes);
app.use("/api/contactUs", contactUsRoutes);

// ==================== ERROR HANDLING ====================

// Manejo de errores de Multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('❌ Multer error:', err);
        return res.status(400).json({
            error: 'File upload error',
            details: err.message
        });
    } else if (err) {
        console.error('❌ Server error:', err);
        return res.status(500).json({
            error: 'Server error',
            details: err.message
        });
    }
    next();
});

// ==================== START SERVER ====================

console.log("⏳ Conectando a MongoDB Atlas...");

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB Atlas conectado correctamente");

        app.listen(PORT, () => {
            console.log(`🚀 Server ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error conectando a MongoDB Atlas:");
        console.error(err);
        process.exit(1);
    });