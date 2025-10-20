// --- Module Imports ---
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require('nodemailer');//import nodemailer library to send forms (send mail through Gmail SMTP)
const submissionsPath = path.join(__dirname, 'data', 'submission.json');
const app = express();

app.use(cors());
app.use(express.static(__dirname)); // allows access to css/, js/, etc.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    // Read the JSON files
        const mexicomap = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data', 'iucnredlist-mexico-data.json'), 'utf8')
        );

    res.render("endangered_species", {
        mexicomap: JSON.stringify(mexicomap)
    }); // renders endangered_species.ejs
});

// Route for recommendations page
app.get("/recommendations", (req, res) => {
    res.render("recommendations"); // renders recommendations.ejs
});

//sending an email
app.post('/send', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {

    let testAccount = await nodemailer.createTestAccount(); //creates a test account

    let transporter = nodemailer.createTransport({ //sets up a connection to the fake SMTP server
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    let info = await transporter.sendMail({ //sends the email
        from: `"${name}" <${email}>`,
      to: testAccount.user,
      subject: subject,
      text: `Message:\n${message}`
    });

     //saves submission into json file
    let submissions = [];

    if (fs.existsSync(submissionsPath)) {
      submissions = JSON.parse(fs.readFileSync(submissionsPath, 'utf8'));
    }

      submissions.push({
      name,
      email,
      subject,
      message,
      date: new Date(),
      previewUrl: nodemailer.getTestMessageUrl(info)
    });

    fs.writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2));

     // Sends a confirmation message
    res.status(200).send(`✅ Email sent! Preview it here: ${nodemailer.getTestMessageUrl(info)}`);

      } catch (err) { //if the mail wasn't sent...
    console.error('Error sending email:', err);//sends a message that there was an error
    res.status(500).send('❌ Failed to send email.');
  }
});

// --- Start the Server ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
