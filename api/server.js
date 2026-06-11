// Standalone contact-form API for cPanel (Setup Node.js App / Passenger).
// Register it with application URL "/api" so the static site can POST to
// /api/contact on the same domain — no CORS needed.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const { transporter, mailOptions } = require('./nodemailer');

const app = express();
app.use(express.json());

const CONTACT_MESSAGE_FIELDS = {
	name: 'Nume',
	email: 'Email',
	phone: 'Telefon',
};

async function verifyCaptcha(token) {
	const res = await fetch(
		'https://www.google.com/recaptcha/api/siteverify',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				secret: process.env.RECAPTCHA_SECRET_KEY,
				response: token,
			}),
		},
	);
	const data = await res.json();
	return data.success === true;
}

const generateEmailContent = (data) => {
	const filteredData = Object.entries(data).filter(([key]) =>
		Object.prototype.hasOwnProperty.call(CONTACT_MESSAGE_FIELDS, key),
	);

	const htmlData = filteredData.reduce((str, [key, val]) => {
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

// Passenger may or may not strip the "/api" mount prefix depending on the
// cPanel configuration, so accept both paths.
app.post(['/contact', '/api/contact'], async (req, res) => {
	try {
		const data = req.body || {};

		if (!data.recaptchaValue) {
			return res.status(400).json({ error: 'Missing recaptchaValue' });
		}

		let captchaOk = false;
		try {
			captchaOk = await verifyCaptcha(data.recaptchaValue);
		} catch (error) {
			console.error('Captcha verification error:', error);
			return res
				.status(400)
				.json({ error: 'Captcha verification failed: ' + error.message });
		}
		if (!captchaOk) {
			return res.status(400).json({ error: 'Failed Captcha verification' });
		}

		// Send mail to the cabinet with the details of the requester
		try {
			await transporter.sendMail({
				...mailOptions,
				...generateEmailContent(data),
				subject: `SmileVillage - cerere de contact de la ${data.email}`,
			});
		} catch (error) {
			console.error('Error sending email to cabinet:', error);
			return res.status(500).json({
				error: 'Failed to send email to cabinet: ' + error.message,
			});
		}

		// Send confirmation email to the requester (non-fatal if it fails)
		try {
			await transporter.sendMail({
				...mailOptions,
				to: data.email,
				subject: 'SmileVillage: Mesajul tău a fost recepționat',
				text: 'Îți mulțumim că ne-ai contactat. Mesajul tău a fost recepționat. Te vom contacta în cel mai scurt timp!',
				html: '<p>Îți mulțumim că ne-ai contactat. Mesajul tău a fost recepționat.</p><p>Te vom contacta în cel mai scurt timp!</p>',
			});
		} catch (error) {
			console.error('Error sending confirmation email:', error);
		}

		return res.status(200).json({ message: 'Form submitted successfully' });
	} catch (error) {
		console.error('Error processing form submission:', error);
		return res.status(500).json({
			error: 'Error processing form submission',
			details: error.message || 'Unknown error',
		});
	}
});

// Health check, useful for verifying the cPanel Node app is up
app.get(['/health', '/api/health'], (req, res) => {
	res.json({
		status: 'ok',
		email: process.env.EMAIL ? 'set' : 'missing',
		recaptcha: process.env.RECAPTCHA_SECRET_KEY ? 'set' : 'missing',
	});
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Contact API listening on port ${port}`);
});
