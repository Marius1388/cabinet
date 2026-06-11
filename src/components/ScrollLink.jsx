import React from 'react';

const ScrollLink = ({ children, className, href, ...props }) => {
	const handleScroll = (e) => {
		e.preventDefault();
		const targetId = e.currentTarget.href.replace(/.*\#/, '');
		const elem = document.getElementById(targetId);

		if (!elem) {
			// '#top' has no element — scroll to the top of the page
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return;
		}

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
		<a {...props} href={href} onClick={handleScroll} className={className}>
			{children}
		</a>
	);
};

export default ScrollLink;
