import React from 'react';
import '@styles/globals.css';

import Nav from '@/components/Nav';
import Footer from '@components/Footer';

import Script from 'next/script';

export const metadata = {
	title: 'Cabinet stomatologic Dr. Roxana Dancea',
	description: 'Cabinet stomatologic Dr. Roxana Dancea - Traian Vuia',
	icons: {
		icon: '/favicon.ico',
	},
};

const RootLayout = ({ children }) => {
	return (
		<html lang="ro">
			<head>
				<Script src="/runtime-config.js" strategy="beforeInteractive" />
			</head>
			<body>
				<div className="main">
					<div className="gradient" />
				</div>
				<main className="app">
					<Nav />
					{children}
					<Footer />
				</main>
			</body>
		</html>
	);
};

export default RootLayout;
