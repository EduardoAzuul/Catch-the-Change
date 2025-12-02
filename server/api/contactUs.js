const express = require("express");
const router = express.Router();
const ContactUsModel = require("../models/contactUs");

console.log('ContactUS loaded correctly');

// POST - Takes the info of the contact forms fields and verifies that they are not empty
//Then saves it in our database
router.post("/", async (req, res) => {
    try {
        console.log('New message from contact form');
        console.log('Received data:', {
            name: req.body.name,
            email: req.body.email,
            messageLength: req.body.message?.length
        });

        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                error: 'Every fields are required',
                received: { name: !!name, email: !!email, message: !!message }
            });
        }

        if (!email.includes('@')) {
            console.log('Invalid email:', email);
            return res.status(400).json({ error: 'Invalid email' });
        }

        console.log('Completed validation');

        const contactUsModel = new ContactUsModel({
            name: name.trim(),
            email: email.trim(),
            message: message.trim()
        });

        console.log('Saving message into database');
        const savedContact = await contactUsModel.save();
        
        console.log('Message saved');
        console.log('Message ID:', savedContact._id.toString());
        console.log(' Details:', {
            id: savedContact._id,
            name: savedContact.name,
            email: savedContact.email,
            messagePreview: savedContact.message.substring(0, 50) + '...',
            createdAt: savedContact.createdAt
        });

        const verify = await ContactUsModel.findById(savedContact._id);
        if (verify) {
            console.log('Message founded in database');
        } else {
            console.log('Message was not saved correctly');
        }

        res.status(201).json({
            id: savedContact._id,
            name: savedContact.name,
            email: savedContact.email,
            message: savedContact.message,
            createdAt: savedContact.createdAt
        });

        console.log('MESSAGE SENT CORRECTLY');

    } catch (error) {
        console.error('Message was not created:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: "Error when saving message",
            details: error.message 
        });
    }
});

// GET - Gets messages from database
router.get("/", async (req, res) => {
    try {
        console.log('Obtaining all messages');
        
        const contacts = await ContactUsModel.find()
            .sort({ createdAt: -1 })
            .lean();
        
        if (contacts.length > 0) {
            console.log('First message:', {
                id: contacts[0]._id,
                name: contacts[0].name,
                email: contacts[0].email,
                date: contacts[0].createdAt
            });
        }

        res.status(200).json(contacts);

    } catch (error) {
        console.error('Didnt get messages:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: "Didnt get messages",
            details: error.message 
        });
    }
});

// GET - Get specific messages by ID to send the mails
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await ContactUsModel.findById(id).lean();

        if (!contact) {
            console.log('Message was not found');
            return res.status(404).json({ error: "Messages was not found" });
        }

        console.log('Founded message:', {
            id: contact._id,
            name: contact.name,
            email: contact.email
        });

        res.status(200).json(contact);

    } catch (error) {
        console.error('Error getting message:', error);
        res.status(500).json({ 
            error: "Error getting message",
            details: error.message 
        });
    }
});

// DELETE - Delete a message from database
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await ContactUsModel.findByIdAndDelete(id);

        if (!deleted) {
            console.log('Message was not founded');
            return res.status(404).json({ error: "Message was not founded" });
        }

        console.log('✅ Message deleted');
        res.status(200).json({ 
            message: "Message deleted",
            id: deleted._id 
        });

    } catch (error) {
        console.error('We werent able to delete the message', error);
        res.status(500).json({ 
            error: "We werent able to delete the message",
            details: error.message 
        });
    }
});

module.exports = router;