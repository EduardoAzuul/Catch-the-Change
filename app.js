// --- Module Imports ---
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.static(__dirname)); // alows access to css/, js/, etc.

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 

// INDEX ROUTE (/): Displays the complete gallery or a character's detail
app.get("/", async (req, res) => {
    res.render("index"); 
});

// Route for main page
app.get("/main", (req, res) => {
    res.render("main"); // renders main.ejs
});

// Route for fishing_activity page
app.get("/fishing_activity", (req, res) => {
    try {
        // Read the GeoJSON files
        const economicZone = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data', 'MexicoEconomicZone.geojson'), 'utf8')
        );
        const protectedAreas1 = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data', 'ProtectedAreas.geojson'), 'utf8')
        );
        const protectedAreas2 = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data', 'ProtectedAreas2.geojson'), 'utf8')
        );
        
        // Pass the data to fishing_activity.ejs
        res.render("fishing_activity", {
            economicZone: JSON.stringify(economicZone),
            protectedAreas1: JSON.stringify(protectedAreas1),
            protectedAreas2: JSON.stringify(protectedAreas2)
        });
    } catch (error) {
        console.error('Error loading GeoJSON files:', error);
        res.status(500).send('Error loading map data');
    }
});

// Route for endangered_species page
app.get("/endangered_species", (req, res) => {
    res.render("endangered_species"); // renders endangered_species.ejs
});

// Route for recommendations page
app.get("/recommendations", (req, res) => {
    res.render("recommendations"); // renders recommendations.ejs
});


// --- Start the Server ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
