const express = require("express");
const router = express.Router();
const ContactUsModel = require("../models/contactUs");

router.post("/", async (req, res) => {
    try {
        const contactUsModel = new ContactUsModel(req.body);
        const cntUs = await contactUsModel.save();

        res.status(201).send(cntUs);
    } catch (error) {
        res.status(500).send({ error: "Error creating contactUs entry" });
    }
});

router.get("/", async (req, res) => {
    try {
        const contactUsCtrl = await ContactUsModel.find().lean();
        
        res.status(200).send(contactUsCtrl);
    } catch (error) {
        res.status(500).send({ error: "Error fetching contactUs entries" });
    }
});

module.exports = router;