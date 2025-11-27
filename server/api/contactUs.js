const express = require("express");
const router = express.Router();
const ContactUsModel = require("../models/contactUs");

console.log('📧 Modelo ContactUs cargado correctamente');

// POST - Crear nuevo mensaje de contacto
router.post("/", async (req, res) => {
    try {
        console.log('📥 Petición POST /api/contactUs - Nuevo mensaje de contacto');
        console.log('📦 Datos recibidos:', {
            name: req.body.name,
            email: req.body.email,
            messageLength: req.body.message?.length
        });

        const { name, email, message } = req.body;

        // Validación
        if (!name || !email || !message) {
            console.log('❌ Faltan campos requeridos');
            return res.status(400).json({ 
                error: 'Todos los campos son requeridos',
                received: { name: !!name, email: !!email, message: !!message }
            });
        }

        if (!email.includes('@')) {
            console.log('❌ Email inválido:', email);
            return res.status(400).json({ error: 'Email inválido' });
        }

        console.log('✅ Validación completada');

        const contactUsModel = new ContactUsModel({
            name: name.trim(),
            email: email.trim(),
            message: message.trim()
        });

        console.log('💾 Guardando mensaje en MongoDB...');
        const savedContact = await contactUsModel.save();
        
        console.log('✅ Mensaje guardado exitosamente en MongoDB');
        console.log('📄 ID del mensaje:', savedContact._id.toString());
        console.log('📄 Detalles:', {
            id: savedContact._id,
            name: savedContact.name,
            email: savedContact.email,
            messagePreview: savedContact.message.substring(0, 50) + '...',
            createdAt: savedContact.createdAt
        });

        // Verificar que se guardó
        const verify = await ContactUsModel.findById(savedContact._id);
        if (verify) {
            console.log('✅ Verificación: Mensaje encontrado en MongoDB');
        } else {
            console.log('⚠️ Advertencia: Mensaje no encontrado después de guardar');
        }

        res.status(201).json({
            id: savedContact._id,
            name: savedContact.name,
            email: savedContact.email,
            message: savedContact.message,
            createdAt: savedContact.createdAt
        });

        console.log('📤 Respuesta enviada al frontend');
        console.log('🎉 Mensaje de contacto procesado exitosamente');

    } catch (error) {
        console.error('❌ Error al crear mensaje de contacto:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: "Error al guardar el mensaje de contacto",
            details: error.message 
        });
    }
});

// GET - Obtener todos los mensajes de contacto
router.get("/", async (req, res) => {
    try {
        console.log('📥 Petición GET /api/contactUs - Obteniendo todos los mensajes');
        
        const contacts = await ContactUsModel.find()
            .sort({ createdAt: -1 }) // Más recientes primero
            .lean();
        
        console.log(`✅ Mensajes obtenidos de MongoDB: ${contacts.length} documentos`);
        
        if (contacts.length > 0) {
            console.log('📄 Primer mensaje:', {
                id: contacts[0]._id,
                name: contacts[0].name,
                email: contacts[0].email,
                date: contacts[0].createdAt
            });
        }

        res.status(200).json(contacts);
        console.log(`📤 Enviando ${contacts.length} mensajes al frontend`);

    } catch (error) {
        console.error('❌ Error al obtener mensajes:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: "Error al obtener los mensajes de contacto",
            details: error.message 
        });
    }
});

// GET - Obtener un mensaje específico por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📥 Petición GET /api/contactUs/${id} - Obteniendo mensaje específico`);

        const contact = await ContactUsModel.findById(id).lean();

        if (!contact) {
            console.log('❌ Mensaje no encontrado');
            return res.status(404).json({ error: "Mensaje no encontrado" });
        }

        console.log('✅ Mensaje encontrado:', {
            id: contact._id,
            name: contact.name,
            email: contact.email
        });

        res.status(200).json(contact);

    } catch (error) {
        console.error('❌ Error al obtener mensaje:', error);
        res.status(500).json({ 
            error: "Error al obtener el mensaje",
            details: error.message 
        });
    }
});

// DELETE - Eliminar un mensaje (útil para administración)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📥 Petición DELETE /api/contactUs/${id} - Eliminando mensaje`);

        const deleted = await ContactUsModel.findByIdAndDelete(id);

        if (!deleted) {
            console.log('❌ Mensaje no encontrado');
            return res.status(404).json({ error: "Mensaje no encontrado" });
        }

        console.log('✅ Mensaje eliminado exitosamente');
        res.status(200).json({ 
            message: "Mensaje eliminado exitosamente",
            id: deleted._id 
        });

    } catch (error) {
        console.error('❌ Error al eliminar mensaje:', error);
        res.status(500).json({ 
            error: "Error al eliminar el mensaje",
            details: error.message 
        });
    }
});

console.log('✅ Contact routes Loaded Successfully');
console.log('📋 Rutas disponibles:');
console.log('   POST   /api/contactUs');
console.log('   GET    /api/contactUs');
console.log('   GET    /api/contactUs/:id');
console.log('   DELETE /api/contactUs/:id');

module.exports = router;