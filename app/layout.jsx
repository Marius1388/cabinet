import { Children } from 'react';
import '../styles/globals.css';

export const metadata = {
	title: 'Cabinet stomatologic Dr. Roxana Dancea',
	description: 'Cabinet stomatologic Dr. Roxana Dancea - Traian Vuia',
};

const RootLayout = ({ children }) => {
	return (
		<html lang="ro">
			<body>
				<div className="main">
					<div className="gradient" />
					<main className="app">{children}</main>
				</div>
			</body>
		</html>
	);
};

export default RootLayout;
