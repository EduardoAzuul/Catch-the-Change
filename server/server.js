const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const { getMarkers } = require("./api/markers");
const { getEconomicZone } = require("./api/economicZoneLayer");
const { getProtectedAreas1 } = require("./api/protectedAreas1Layer");
const { getProtectedAreas2 } = require("./api/protectedAreas2Layer");
const postsRoutes = require("./api/posts");
const contactUsRoutes = require("./api/contactUs");


const app = express();
const PORT = process.env.PORT || 4000;

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

// ==================== MONGODB MODELS ====================

console.log("🧪 Cargando modelos de MongoDB...");

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: String,
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
        if (err)
            return res.status(403).json({ error: "Token inválido" });

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
            user.picture = picture;
            await user.save();
        } else {
            user = await User.create({
                googleId: sub,
                email,
                name,
                picture,
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                googleId: user.googleId,
                name: user.name,
                email: user.email,
                picture: user.picture,
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

        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: "Error en el servidor",
            details: error.message,
        });
    }
});

app.put("/api/user/profile", authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;

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
            picture: user.picture,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error en el servidor",
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
