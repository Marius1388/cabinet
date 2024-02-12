'use client';
import ScrollLink from './ScrollLink';
import { useState, useEffect } from 'react';

const Nav = () => {
	return (
		<nav className="fixed left-0 right-0 top-0 z-20 box-border flex w-screen items-center justify-center bg-black py-3 text-white sm:text-sm md:text-base ">
			<div className="flex-between flex w-3/5 max-w-3xl items-center justify-center max-sm:w-full ">
				<ScrollLink href="#despre-noi">Despre noi</ScrollLink>
				<ScrollLink href="#servicii">Servicii</ScrollLink>
				<ScrollLink href="#galerie">Galerie</ScrollLink>
				<ScrollLink href="#contact">Contact</ScrollLink>
			</div>
		</nav>
	);
};

export default Nav;
