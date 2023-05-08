'use client';
import Link from 'next/link';

// component definition
const ScrollLink = ({ children, ...props }) => {
	const handleScroll = (e) => {
		e.preventDefault();
		//remove everything before the hash
		const targetId = e.currentTarget.href.replace(/.*\#/, '');
		const elem = document.getElementById(targetId);
		window.scrollTo({
			top: elem?.getBoundingClientRect().top,
			behavior: 'smooth',
		});
	};
	return (
		<Link {...props} onClick={handleScroll}>
			{children}
		</Link>
	);
};
export default ScrollLink;
