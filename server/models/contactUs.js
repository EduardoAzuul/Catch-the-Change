const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, { 
    timestamps: true 
});

const ContactUsModel = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUsModel;