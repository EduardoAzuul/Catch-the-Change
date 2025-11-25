const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { getMarkers } = require("./api/markers");
const { getEconomicZone } = require("./api/economicZoneLayer");
const { getProtectedAreas1 } = require("./api/protectedAreas1Layer");
const { getProtectedAreas2 } = require("./api/protectedAreas2Layer");

// 👉 Importa tus rutas de posts
const postsRoutes = require("./api/posts");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json()); // ← Necesario para leer JSON del frontend

// Conexión a Mongo Atlas
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        // Servidor encendido
        app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        });

        // --- Rutas ya existentes ---
        app.get("/api/markers", getMarkers);
        app.get("/api/economicZoneLayer", getEconomicZone);
        app.get("/api/protectedAreas1Layer", getProtectedAreas1);
        app.get("/api/protectedAreas2Layer", getProtectedAreas2);

        // --- Rutas nuevas para posts ---
        app.use("/api/posts", postsRoutes);
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
