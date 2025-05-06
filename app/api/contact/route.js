// app/api/contact/route.js
import { transporter, mailOptions } from '../../../utils/nodemailer';
import axios from 'axios';
import { NextResponse } from 'next/server';

const CONTACT_MESSAGE_FIELDS = {
	name: 'Nume',
	email: 'Email',
	phone: 'Telefon',
};

// Use these export options to ensure proper handling in production
export const dynamic = 'force-dynamic'; // Important for cPanel to prevent stale responses
export const runtime = 'nodejs'; // Explicitly set Node.js runtime

async function verifyCaptcha(token) {
	try {
		const res = await axios.post(
			`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}&response=${token}`,
		);
		if (res.data.success) {
			return 'success';
		} else {
			throw new Error('Failed Captcha');
		}
	} catch (error) {
		console.error('Captcha verification error:', error);
		throw new Error('Failed Captcha: ' + (error.message || 'Unknown error'));
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
		return true;
	} catch (error) {
		console.error('Error sending confirmation email:', error);
		return false;
	}
};

// Updated handler with better error handling for cPanel deployment
export async function POST(req) {
	console.log('Processing contact form submission...');

	try {
		// Unified approach to parse request data
		let jsonData;
		try {
			console.log('Attempting to parse request as JSON...');
			jsonData = await req.json();
			console.log(
				'Successfully parsed JSON data:',
				JSON.stringify(jsonData),
			);
		} catch (error) {
			console.error('JSON parsing failed, trying text parsing...');
			const text = await req.text();
			try {
				jsonData = JSON.parse(text);
				console.log(
					'Successfully parsed text data as JSON:',
					JSON.stringify(jsonData),
				);
			} catch (innerError) {
				console.error('Failed to parse request data:', innerError);
				return NextResponse.json(
					{ error: 'Invalid request format' },
					{ status: 400 },
				);
			}
		}

		// Validate recaptcha
		if (!jsonData.recaptchaValue) {
			console.error('Missing recaptchaValue in request');
			return NextResponse.json(
				{ error: 'Missing recaptchaValue' },
				{ status: 400 },
			);
		}

		// Perform server-side reCAPTCHA verification
		try {
			console.log('Verifying reCAPTCHA...');
			const captchaVerification = await verifyCaptcha(
				jsonData.recaptchaValue,
			);
			if (captchaVerification !== 'success') {
				console.error('reCAPTCHA verification failed');
				return NextResponse.json(
					{ error: 'Failed Captcha verification' },
					{ status: 400 },
				);
			}
			console.log('reCAPTCHA verification successful');
		} catch (error) {
			console.error('Captcha verification error:', error);
			return NextResponse.json(
				{ error: 'Captcha verification failed: ' + error.message },
				{ status: 400 },
			);
		}

		// Send mail to the cabinet with the details of the requester
		try {
			console.log('Sending email to cabinet...');
			await transporter.sendMail({
				...mailOptions,
				...generateEmailContent(jsonData),
				subject: `SmileVillage - cerere de contact de la ${jsonData.email}`,
			});
			console.log('Email to cabinet sent successfully');
		} catch (error) {
			console.error('Error sending email to cabinet:', error);
			return NextResponse.json(
				{ error: 'Failed to send email to cabinet: ' + error.message },
				{ status: 500 },
			);
		}

		// Send confirmation email to the requester
		try {
			console.log('Sending confirmation email to user...');
			await sendConfirmationEmail(
				jsonData.email,
				'SmileVillage: Mesajul tău a fost recepționat',
				{
					text: 'Îți mulțumim că ne-ai contactat. Mesajul tău a fost recepționat. Te vom contacta în cel mai scurt timp!',
					html: '<p>Îți mulțumim că ne-ai contactat. Mesajul tău a fost recepționat.</p></br><p>Te vom contacta în cel mai scurt timp!</p>',
				},
			);
			console.log('Confirmation email sent successfully');
		} catch (error) {
			console.error('Error sending confirmation email:', error);
			// Continue even if confirmation email fails
		}

		// Return success response
		console.log('Form submission processed successfully');
		return NextResponse.json(
			{ message: 'Form submitted successfully' },
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error processing form submission:', error);
		return NextResponse.json(
			{
				error: 'Error processing form submission',
				details: error.message || 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
