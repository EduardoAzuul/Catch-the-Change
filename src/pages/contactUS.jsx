export default async function contactUS(data) {

    //send email
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
    }

    const emailres = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
    });

    //store in db
    const url = process.env.REACT_APP_API_URL?.replace(/\/$/, '');
    const res = await fetch(`${url}/contactUs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const result = await res.json();

    return result;
}

