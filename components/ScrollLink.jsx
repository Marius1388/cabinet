'use client';
import React from 'react';
import Link from 'next/link';

const ScrollLink = ({ children, className, ...props }) => {
	const handleScroll = (e) => {
		e.preventDefault();
		const targetId = e.currentTarget.href.replace(/.*\#/, '');
		const elem = document.getElementById(targetId);

		if (!elem) return;

		const navHeight = document.querySelector('nav').offsetHeight;
		const offset = navHeight + 20;

		const elemPosition =
			elem.getBoundingClientRect().top + window.pageYOffset;

		window.scrollTo({
			top: elemPosition - offset,
			behavior: 'smooth',
		});
	};

	return (
		<Link {...props} onClick={handleScroll} className={className}>
			{children}
		</Link>
	);
};

export default ScrollLink;
