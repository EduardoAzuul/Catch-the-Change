const mongoose = require('mongoose');
const express = require ('express');
require('dotenv').config();
const cors = require("cors");

const { getMarkers } = require("./api/markers");
const { getEconomicZone } = require("./api/economicZoneLayer");
const { getProtectedAreas1 } = require("./api/protectedAreas1Layer");
const { getProtectedAreas2 } = require("./api/protectedAreas2Layer");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

        app.get("/api/markers", getMarkers);
        app.get("/api/economicZoneLayer", getEconomicZone);
        app.get("/api/protectedAreas1Layer", getProtectedAreas1);
        app.get("/api/protectedAreas2Layer", getProtectedAreas2);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });