import React, { useState, useRef } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { useRouter } from 'next/router';

const Formular = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [alert, setAlert] = useState('');
	const recaptchaRef = useRef(null);
	const [recaptchaValue, setRecaptchaValue] = useState(null);
	const [isVerified, setIsVerified] = useState(false);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAlert('');
		setAnchorEl(null);
	};

	const validatePhone = (phoneNumber) => {
		// Common European phone number formats
		const phoneRegex =
			/^(?:(?:\+|00)44|0|\+32|0\s*[67]|0\s*1[0-9])\s*[1-9](?:\s*\d){8,14}$/;
		return phoneRegex.test(phoneNumber);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (name !== '' && email !== '' && phone !== '' && isVerified) {
			try {
				if (!recaptchaValue) {
					console.error('reCAPTCHA verification failed');
					setAlert('error');
					return;
				}
				if (!validatePhone(phone)) {
					console.error('Invalid phone number');
					setAlert('phone');
					return;
				}

				const data = { name, email, phone, recaptchaValue };

				const res = await axios.post('/api/contact', data, {
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (res.status === 200) {
					setAlert('success');
				} else {
					setAlert('error');
				}
			} catch (error) {
				console.error('error:', error);
				setAlert('error');
			}
		} else {
			setAlert('error');
		}
	};

	const handleCaptchaSubmission = (token) => {
		setRecaptchaValue(token);
		setIsVerified(!!token);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

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
						Completează toate câmpurile!
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
					<ReCAPTCHA
						sitekey={process.env.NEXT_PUBLIC_LOCALHOST_RECAPTCHA_SITE_KEY}
						ref={recaptchaRef}
						onChange={handleCaptchaSubmission}
					/>
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
					<Button className="mb-2" type="submit" disabled={!isVerified}>
						Trimite
					</Button>
				</form>
			</Popover>
		</div>
	);
};

export default Formular;
