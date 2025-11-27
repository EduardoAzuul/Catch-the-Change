// server/api/auth/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
router.post("/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ error: "Falta credential" });
        }

        // Verificar el token de Google
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        let user = await User.findOne({ googleId: payload.sub });

        // Crear usuario si no existe
        if (!user) {
            user = await User.create({
                googleId: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({ user, token });

    } catch (err) {
        console.error("Auth error:", err);
        res.status(500).json({ error: "Error autenticando usuario" });
    }
});

export default router;
