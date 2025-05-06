'use client';
import React, { useState, useEffect } from 'react';
import ScrollLink from './ScrollLink';

const Nav = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Handle scroll event to change navbar appearance
	useEffect(() => {
		const handleScroll = () => {
			const scrollThreshold = 10;
			if (window.scrollY > scrollThreshold) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initial check

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	// Class definitions with blur and gradient effects
	const navBaseClasses =
		'fixed left-0 right-0 top-0 z-20 transition-all duration-350 ease-in-out';

	// Use backdrop-filter for blur effect when scrolled with a subtle gradient
	const navScrolledClasses =
		'py-2 shadow-lg border-b border-gray-200 bg-gradient-to-r from-white/80 via-white/85 to-white/80 backdrop-filter backdrop-blur-md';

	// For initial state, use a gradient with blur
	const navInitialClasses =
		'py-4 bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-filter backdrop-blur-sm';

	const linkBaseClasses = 'nav_link transition-colors duration-300';
	const linkScrolledClasses = 'text-textColor-primary hover:text-primary';
	const linkInitialClasses = 'text-white hover:text-gray-200';

	const logoTextColor = isScrolled ? 'text-primary' : 'text-white';

	const ctaBaseClasses =
		'btn rounded-full px-5 py-2 transition-all duration-300';
	const ctaScrolledClasses = 'bg-primary text-white hover:bg-primary-dark';
	const ctaInitialClasses =
		'bg-white text-primary hover:bg-gray-100 shadow-sm';

	return (
		<nav
			className={`${navBaseClasses} ${
				isScrolled ? navScrolledClasses : navInitialClasses
			}`}
			aria-label="Main Navigation">
			<div className="container mx-auto flex items-center justify-between px-4">
				{/* Logo */}
				<ScrollLink
					href="#top"
					className="flex items-center"
					onClick={closeMobileMenu}
					aria-label="SmileVillage Home">
					<span
						className={`font-montserrat text-2xl font-bold transition-colors duration-300 sm:text-3xl ${logoTextColor}`}>
						SmileVillage
					</span>
				</ScrollLink>

				{/* Desktop Navigation */}
				<div className="hidden items-center space-x-1 md:flex md:space-x-4 lg:space-x-6">
					<ScrollLink
						href="#despre-noi"
						className={`${linkBaseClasses} ${
							isScrolled ? linkScrolledClasses : linkInitialClasses
						}`}>
						Despre noi
					</ScrollLink>
					<ScrollLink
						href="#servicii"
						className={`${linkBaseClasses} ${
							isScrolled ? linkScrolledClasses : linkInitialClasses
						}`}>
						Servicii
					</ScrollLink>
					<ScrollLink
						href="#galerie"
						className={`${linkBaseClasses} ${
							isScrolled ? linkScrolledClasses : linkInitialClasses
						}`}>
						Galerie
					</ScrollLink>
					<ScrollLink
						href="#contact"
						className={`${ctaBaseClasses} ${
							isScrolled ? ctaScrolledClasses : ctaInitialClasses
						}`}>
						Contact
					</ScrollLink>
				</div>

				{/* Mobile Menu Button */}
				<div className="md:hidden">
					<button
						onClick={toggleMobileMenu}
						className={`rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
							isScrolled
								? 'text-primary focus:ring-primary'
								: 'text-white focus:ring-white'
						}`}
						aria-controls="mobile-menu"
						aria-expanded={isMobileMenuOpen}
						aria-label={
							isMobileMenuOpen ? 'Close main menu' : 'Open main menu'
						}>
						<svg
							className="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							{isMobileMenuOpen ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							)}
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				id="mobile-menu"
				className={`duration-350 overflow-hidden bg-white transition-all ease-in-out md:hidden ${
					isMobileMenuOpen ? 'max-h-80 shadow-md' : 'max-h-0'
				}`}>
				<div className="container mx-auto flex flex-col space-y-1 px-5 pb-4 pt-2">
					<ScrollLink
						href="#despre-noi"
						className="text-textColor-primary block py-2 transition-colors hover:text-primary"
						onClick={closeMobileMenu}>
						Despre noi
					</ScrollLink>
					<ScrollLink
						href="#servicii"
						className="text-textColor-primary block py-2 transition-colors hover:text-primary"
						onClick={closeMobileMenu}>
						Servicii
					</ScrollLink>
					<ScrollLink
						href="#galerie"
						className="text-textColor-primary block py-2 transition-colors hover:text-primary"
						onClick={closeMobileMenu}>
						Galerie
					</ScrollLink>
					<ScrollLink
						href="#contact"
						className="text-textColor-primary block py-2 font-medium transition-colors hover:text-primary"
						onClick={closeMobileMenu}>
						Contact
					</ScrollLink>
				</div>
			</div>
		</nav>
	);
};

export default Nav;
