const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export default async function contactUS(data) {
    try {
        console.log('📤 Enviando mensaje de contacto...');
        console.log('Datos:', { 
            name: data.name, 
            email: data.email, 
            messageLength: data.message?.length 
        });

        // 1. Enviar email con EmailJS
        console.log('📧 Enviando email...');
        const service_id = process.env.REACT_APP_EMAILJS_SERVICE_ID;
        const user_id = process.env.REACT_APP_EMAILJS_USER_ID;
        const template_id = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

        const emailData = {
            service_id: service_id,
            user_id: user_id,
            template_id: template_id,
            template_params: {
                'to_name': data.name,
                'to_email': data.email,
                'from_email': 'support@catchthechange.com',
                'message': data.message,
            }
        };

        const emailres = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailData),
        });

        if (!emailres.ok) {
            console.warn('⚠️ Error al enviar email, pero continuando...');
        } else {
            console.log('✅ Email enviado exitosamente');
        }

        // 2. Guardar en MongoDB
        console.log('💾 Guardando en base de datos...');
        const url = API_URL.replace(/\/$/, '');
        const res = await fetch(`${url}/contactUs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                message: data.message
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error al guardar el mensaje');
        }

        const result = await res.json();
        console.log('✅ Mensaje guardado en MongoDB:', result.id);
        
        return {
            success: true,
            data: result,
            message: 'Mensaje enviado exitosamente'
        };

    } catch (error) {
        console.error('❌ Error en contactUS:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al enviar el mensaje'
        };
    }
}