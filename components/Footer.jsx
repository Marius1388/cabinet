import React from 'react';

const Footer = () => {
	return (
		<footer>
			<div className="z-50 flex w-full items-center space-x-4 pb-5 pr-4 ">
				<a
					href="https://www.madr.ro/dezvoltare-rurala.html"
					target="_blank"
					rel="noopener noreferrer">
					<img
						src="/assets/images/PNDR.jpg"
						alt="PNDR"
						className="h-16 w-auto md:h-24"
					/>
				</a>
				<a
					href="https://www.afir.ro/"
					target="_blank"
					rel="noopener noreferrer">
					<img
						src="/assets/images/AFIR.jpg"
						alt="AFIR"
						className="h-16 w-auto md:h-24"
					/>
				</a>
				<a
					href="https://www.gov.ro/"
					target="_blank"
					rel="noopener noreferrer">
					<img
						src="/assets/images/GUV.png"
						alt="Guvernul Romaniei"
						className="h-16 w-auto md:h-24"
					/>
				</a>
				<a
					href="https://european-union.europa.eu/index_en"
					target="_blank"
					rel="noopener noreferrer">
					<img
						src="/assets/images/EU.png"
						alt="EU website"
						className="h-16 w-auto md:h-24"
					/>
				</a>
			</div>
		</footer>
	);
};

export default Footer;
