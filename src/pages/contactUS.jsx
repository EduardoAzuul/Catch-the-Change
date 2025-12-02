const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export default async function contactUS(data) {
    try {
        console.log('Datos:', { 
            name: data.name, 
            email: data.email, 
            messageLength: data.message?.length 
        });

        //the message from contact form is sent by email.js
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
        } else {
            console.log('Email was sent successfully');
        }

        //The mail is saved in database
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
            throw new Error(errorData.error || 'Message was not saved');
        }

        const result = await res.json();
        console.log('Message in database:', result.id);
        
        return {
            success: true,
            data: result,
            message: 'Message was sent'
        };

    } catch (error) {
        console.error('Error in contactUS:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}