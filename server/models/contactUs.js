const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: false
    }
}, { timestamps: true });

const ContactUsModel = mongoose.model('ContactUS', contactUsSchema);

module.exports = ContactUsModel;
