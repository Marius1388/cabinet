'use client';
import Link from 'next/link';

// component definition
const ScrollLink = ({ children, ...props }) => {
	const handleScroll = (e) => {
		e.preventDefault();
		const targetId = e.currentTarget.href.replace(/.*\#/, '');
		const elem = document.getElementById(targetId);
		elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
