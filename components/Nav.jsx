'use client';
import ScrollLink from './ScrollLink';
import { useState, useEffect } from 'react';

const Nav = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	useEffect(() => {}, []);

	return (
		<nav className="sticky top-0 flex w-screen items-center justify-center bg-black py-3 text-white">
			<div className="flex-between flex w-3/5 max-w-3xl items-center justify-center ">
				<ScrollLink href="#despre-noi">Despre noi</ScrollLink>
				<ScrollLink href="#servicii">Servicii</ScrollLink>
				<ScrollLink href="#galerie">Galerie</ScrollLink>
				<ScrollLink href="#smileDiaspora">Smile Diaspora</ScrollLink>
				<ScrollLink href="#contact">Contact</ScrollLink>
			</div>
		</nav>
	);
};

export default Nav;
