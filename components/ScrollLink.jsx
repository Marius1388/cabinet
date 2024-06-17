'use client';
import React from 'react';
import Link from 'next/link';

// component definition
const ScrollLink = ({ children, ...props }) => {
	const handleScroll = (e) => {
		e.preventDefault();
		const targetId = e.currentTarget.href.replace(/.*\#/, '');
		const elem = document.getElementById(targetId);
		const offset = 80; // Adjust this value as needed to offset for your fixed navbar
		const elemPosition =
			elem.getBoundingClientRect().top + window.pageYOffset;
		window.scrollTo({
			top: elemPosition - offset,
			behavior: 'smooth',
		});
	};
	return (
		<Link
			{...props}
			onClick={handleScroll}
			className="max-sm:mx-1 max-sm:text-xs">
			{children}
		</Link>
	);
};
export default ScrollLink;
