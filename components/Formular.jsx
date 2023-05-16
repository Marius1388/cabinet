'use client';
import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const Formular = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [alert, setAlert] = useState('');

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (name !== '' && email !== '' && phone !== '') {
			console.log({ name, email, phone });
			setName('');
			setEmail('');
			setPhone('');
			setAlert('success');
			handleClose();
		} else {
			// alert('Completeaza toate campurile');
			setAlert('error');
		}
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
						className='"fixed left-0 right-0 top-0'
						onClose={() => setAlert('')}>
						Felicitari! Vei primi un email de confirmare!
					</Alert>
				)}
				{alert === 'error' && (
					<Alert
						variant="filled"
						severity="error"
						className='"fixed left-0 right-0 top-0'
						onClose={() => setAlert('')}>
						Completeaza toate campurile!
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
						label="Adresa de mail"
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
					<Button className="mb-2" type="submit">
						Trimite
					</Button>
				</form>
			</Popover>
		</div>
	);
};

export default Formular;
