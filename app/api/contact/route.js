import { transporter, mailOptions } from '../../../utils/nodemailer';

const CONTACT_MESSAGE_FIELDS = {
	name: 'Nume',
	email: 'Email',
	phone: 'Telefon',
};

const generateEmailContent = (data) => {
	const htmlData = Object.entries(data).reduce((str, [key, val]) => {
		return (str += `<tr>
                            <td style="padding: 8px 0;" class="form-heading">${CONTACT_MESSAGE_FIELDS[key]}</td>
                            <td style="padding: 8px 0;" class="form-answer">${val}</td>
                        </tr>`);
	}, '');

	const confirmationMessage = `
        <p style="font-size: 16px; color: #4CAF50; margin-top: 20px;">
            A fost trimis un email automat de confirmare către: <strong>${data.email}</strong>.
        </p>
    `;

	return {
		html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Contact Message</title>
                    <meta charset="utf-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <style type="text/css">
                        /* Styles as before */
                    </style>
                </head>
                <body style="margin: 0 !important; padding: 0 !important; background: #fff">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td bgcolor="#ffffff" style="padding: 20px">
                                <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td>
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="padding: 0 0 0 0; font-size: 16px; line-height: 25px; color: #232323;">
                                                        <h2 style="margin-bottom: 15px;">Cerere de contact SmileVillage</h2>
                                                        <table>
                                                            ${htmlData}
                                                        </table>
                                                        ${confirmationMessage}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
        `,
	};
};

const sendConfirmationEmail = async (email, subject, content) => {
	try {
		await transporter.sendMail({
			...mailOptions,
			to: email,
			subject,
			...content,
		});
		console.log(`Confirmation email sent to ${email}`);
	} catch (error) {
		console.log('Error sending confirmation email:', error);
	}
};

export async function POST(req) {
	const data = await req.json();

	// Send mail to the cabinet with the details of the requester
	try {
		await transporter.sendMail({
			...mailOptions,
			...generateEmailContent(data),
			subject: `SmileVillage - cerere de contact de la ${data.email}`,
		});
		console.log('Email to cabinet sent successfully');
	} catch (error) {
		console.log('Error sending email to cabinet:', error);
	}

	// Send confirmation email to the requester
	const confirmationSubject = 'SmileVillage: Mesajul tău a fost recepționat';
	const confirmationContent = {
		text: 'Îți mulțumim că ne-ai contactat. Mesajul tău a fost recepționat. Te vom contacta în cel mai scurt timp!',
		html: '<p>Îți mulțumim că ne-ai contactat. Mesajul tău a fost recepționat.</p></br><p>Te vom contacta în cel mai scurt timp!</p>',
	};

	sendConfirmationEmail(data.email, confirmationSubject, confirmationContent);

	return new Response('OK');
}
