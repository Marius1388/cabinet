'use client';

import React, { useState, useRef, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { getRecaptchaSiteKey } from '@/config/envConfig';

const Formular = () => {
	const [loading, setLoading] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [alert, setAlert] = useState('');
	const recaptchaRef = useRef(null);
	const [recaptchaValue, setRecaptchaValue] = useState(null);
	const [isVerified, setIsVerified] = useState(false);
	const [isBrowser, setIsBrowser] = useState(false);
	const [submissionAttempts, setSubmissionAttempts] = useState(0);

	// Set isBrowser to true once component mounts
	useEffect(() => {
		setIsBrowser(true);
		console.log('Formular component mounted');
		// Log reCAPTCHA key status for debugging
		console.log(
			'reCAPTCHA key available:',
			getRecaptchaSiteKey() ? 'Yes' : 'No',
		);
	}, []);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAlert('');
		setAnchorEl(null);
		setSubmissionAttempts(0);
	};

	const validatePhone = (phoneNumber) => {
		// Regular expression for Romanian phone numbers, including +40 country code
		const romaniaRegex = /^\+(?:40)?[1-9]\d{8}$/;

		// Additional check for Romanian mobile numbers starting with '07'
		const mobileRegex = /^07[2-8]\d{7}$/;

		return romaniaRegex.test(phoneNumber) || mobileRegex.test(phoneNumber);
	};

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const resetForm = () => {
		setName('');
		setEmail('');
		setPhone('');
		if (recaptchaRef.current) {
			recaptchaRef.current.reset();
		}
		setRecaptchaValue(null);
		setIsVerified(false);
		setSubmissionAttempts(0);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmissionAttempts((prev) => prev + 1);

		try {
			setLoading(true);

			if (name === '' || email === '' || phone === '' || !isVerified) {
				console.log('Form validation failed - missing required fields');
				setAlert('error');
				setLoading(false);
				return;
			}

			if (!recaptchaValue) {
				console.log('ReCAPTCHA verification failed');
				setAlert('error');
				setLoading(false);
				return;
			}

			if (!validatePhone(phone)) {
				console.log('Invalid phone number:', phone);
				setAlert('phone');
				setLoading(false);
				return;
			}

			if (!validateEmail(email)) {
				console.log('Invalid email:', email);
				setAlert('error');
				setLoading(false);
				return;
			}

			const data = {
				name,
				email,
				phone,
				recaptchaValue,
				timestamp: new Date().toISOString(),
				attempt: submissionAttempts,
			};

			console.log('Submitting form data:', data);

			try {
				// Add caching prevention headers and request ID for tracing
				const res = await axios.post('/api/contact', data, {
					headers: {
						'Content-Type': 'application/json',
						'Cache-Control':
							'no-cache, no-store, max-age=0, must-revalidate',
						Pragma: 'no-cache',
						Expires: '0',
						'X-Request-ID': `form-${Date.now()}-${Math.random()
							.toString(36)
							.substring(2, 15)}`,
					},
					timeout: 15000, // 15 second timeout
				});

				console.log('Form submission response:', res.status, res.data);

				if (res.status === 200) {
					setAlert('success');
					resetForm();
					setTimeout(() => handleClose(), 2000);
				} else {
					console.error('Server error:', res.status, res.data);
					setAlert('error');
				}
			} catch (axiosError) {
				// Detailed error logging
				console.error(
					'Axios request failed:',
					axiosError.message,
					'Response data:',
					axiosError.response?.data,
					'Status:',
					axiosError.response?.status,
				);
				setAlert('error');
			}
		} catch (error) {
			console.error('Client-side error:', error);
			setAlert('error');
		} finally {
			setLoading(false);
		}
	};

	const handleCaptchaSubmission = (token) => {
		console.log('ReCAPTCHA token received:', token ? 'valid' : 'invalid');
		setRecaptchaValue(token);
		setIsVerified(!!token);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	// Only render form if in browser environment
	if (!isBrowser) {
		return (
			<IconButton
				aria-label="Contact form"
				variant="contained"
				onClick={() => {}}>
				<MailOutlineIcon fontSize="large" />
			</IconButton>
		);
	}

	// Get recaptcha key
	const recaptchaKey = getRecaptchaSiteKey();

	return (
		<div>
			<IconButton
				aria-describedby={id}
				variant="contained"
				onClick={handleClick}>
				<MailOutlineIcon fontSize="large" />
			</IconButton>

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
				{alert === 'success' && (
					<Alert
						variant="filled"
						severity="success"
						onClose={() => setAlert('')}>
						Felicitări! Vei primi un email de confirmare!
					</Alert>
				)}
				{alert === 'error' && (
					<Alert
						variant="filled"
						severity="error"
						onClose={() => setAlert('')}>
						Completează toate câmpurile corect!
					</Alert>
				)}
				{alert === 'phone' && (
					<Alert
						variant="filled"
						severity="error"
						onClose={() => setAlert('')}>
						Numărul de telefon nu este valid!
					</Alert>
				)}

				<Typography
					sx={{ p: 2 }}
					className="desc text-center font-semibold">
					Introdu datele tale
				</Typography>

				<form
					className="mx-3 flex flex-col justify-center"
					onSubmit={handleSubmit}>
					{recaptchaKey ? (
						<ReCAPTCHA
							sitekey={recaptchaKey}
							ref={recaptchaRef}
							onChange={handleCaptchaSubmission}
						/>
					) : (
						<Alert variant="outlined" severity="warning" className="mb-2">
							reCAPTCHA key missing. Contact administrators.
						</Alert>
					)}
					<TextField
						type="text"
						variant="outlined"
						label="Nume"
						className="mb-2"
						onChange={(e) => setName(e.target.value)}
						value={name}
					/>
					<TextField
						type="email"
						variant="outlined"
						label="Adresa de email"
						className="mb-2"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
					<TextField
						type="text"
						variant="outlined"
						label="Telefon"
						className="mb-2"
						onChange={(e) => setPhone(e.target.value)}
						value={phone}
					/>
					<Button
						className="mb-2"
						type="submit"
						disabled={
							!isVerified ||
							name === '' ||
							!validateEmail(email) ||
							!validatePhone(phone) ||
							loading === true
						}>
						Trimite{' '}
						{loading === true && (
							<CircularProgress size={24} sx={{ marginLeft: 2 }} />
						)}
					</Button>
				</form>
			</Popover>
		</div>
	);
};

export default Formular;
