import { transporter, mailOptions } from '../../../utils/nodemailer';
import axios from 'axios';
import { NextResponse } from 'next/server';

const CONTACT_MESSAGE_FIELDS = {
	name: 'Nume',
	email: 'Email',
	phone: 'Telefon',
};

async function verifyCaptcha(token) {
	const res = await axios.post(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}&response=${token}`,
	);
	if (res.data.success) {
		return 'success';
	} else {
		throw new Error('Failed Captcha');
	}
}
const generateEmailContent = (data) => {
	// Exclude 'token' or 'recaptchaValue' field from the email content
	const filteredData = Object.entries(data).filter(
		([key]) => key !== 'token' && key !== 'recaptchaValue',
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
		return;
	}
};

export const POST = async (req) => {
	if (req.method === 'POST') {
		try {
			const data = await req.text(); // Read the data from the ReadableStream

			// Parse the data as JSON
			const jsonData = JSON.parse(data);

			// Check if 'recaptchaValue' is present in the jsonData
			if (!jsonData.recaptchaValue) {
				throw new Error('Missing recaptchaValue');
			}

			// Perform server-side reCAPTCHA verification
			const captchaVerification = await verifyCaptcha(
				jsonData.recaptchaValue,
			);
			if (captchaVerification !== 'success') {
				throw new Error('Failed Captcha');
			}

			// Send mail to the cabinet with the details of the requester
			await transporter.sendMail({
				...mailOptions,
				...generateEmailContent(jsonData),
				subject: `SmileVillage - cerere de contact de la ${jsonData.email}`,
			});
			console.log('Email to cabinet sent successfully');

			// Send confirmation email to the requester
			await sendConfirmationEmail(
				jsonData.email,
				'SmileVillage: Mesajul tău a fost recepționat',
				{
					text: 'Îți mulțumim că ne-ai contactat. Mesajul tău a fost recepționat. Te vom contacta în cel mai scurt timp!',
					html: '<p>Îți mulțumim că ne-ai contactat. Mesajul tău a fost recepționat.</p></br><p>Te vom contacta în cel mai scurt timp!</p>',
				},
			);

			return new NextResponse(200, {
				message: 'Form submitted successfully',
			});
		} catch (error) {
			console.error('Error processing form submission:', error);
			return new NextResponse(500, {
				error: 'Error processing form submission',
				details: error.message || 'Unknown error',
			});
		}
	} else {
		return new NextResponse(405, { error: 'Method Not Allowed' });
	}
};
