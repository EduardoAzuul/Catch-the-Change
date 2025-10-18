// --- Module Imports ---
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.static(__dirname)); // permite acceder a css/, js/, etc.

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // asegúrate que tus .ejs estén en /views

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
    res.render("fishing_activity"); // renders fishing_activity.ejs
});

// Route for endangered_species page
app.get("/endangered_species", (req, res) => {
    res.render("endangered_species"); // renders endangered_species.ejs
});

// Route for recommendations page
app.get("/recommendations", (req, res) => {
    res.render("recommendations"); // renders recommendations.ejs
});

// Route for map page
app.get("/map", (req, res) => {
    res.render("map"); // renders map.ejs
});

// --- Start the Server ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
