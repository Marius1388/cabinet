import React from 'react';

const partners = [
	{
		href: 'https://www.madr.ro/dezvoltare-rurala.html',
		src: '/assets/images/PNDR.jpg',
		alt: 'PNDR',
	},
	{
		href: 'https://www.afir.ro/',
		src: '/assets/images/AFIR.jpg',
		alt: 'AFIR',
	},
	{
		href: 'https://www.gov.ro/',
		src: '/assets/images/GUV.png',
		alt: 'Guvernul Romaniei',
	},
	{
		href: 'https://european-union.europa.eu/index_en',
		src: '/assets/images/EU.png',
		alt: 'EU website',
	},
];

const Footer = () => {
	return (
		<footer className="w-full">
			<div className="flex w-full flex-wrap items-center justify-center gap-4 py-6 md:gap-8">
				{partners.map((p) => (
					<a
						key={p.alt}
						href={p.href}
						target="_blank"
						rel="noopener noreferrer">
						<img src={p.src} alt={p.alt} className="h-16 w-auto md:h-24" />
					</a>
				))}
			</div>
		</footer>
	);
};

export default Footer;
