'use client';
import React, { useEffect } from 'react';
import DespreNoi from '@components/DespreNoi';
import Servicii from '@components/Servicii';
import Galerie from '@components/Galerie';
import Contact from '@components/Contact';
import { ChevronUp } from 'lucide-react';

const Home = () => {
	useEffect(() => {
		// Function to check scroll position and show/hide scroll-to-top button
		const handleScroll = () => {
			const scrollButton = document.getElementById('scroll-to-top');
			if (window.pageYOffset > 300) {
				scrollButton.classList.add('visible');
			} else {
				scrollButton.classList.remove('visible');
			}
		};

		// Add scroll event listener
		window.addEventListener('scroll', handleScroll);

		// Initialize animations if IntersectionObserver is available
		if ('IntersectionObserver' in window) {
			const animateElements = () => {
				const elements = document.querySelectorAll(
					'.fade-in, .slide-in-left, .slide-in-right',
				);

				const observer = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								entry.target.classList.add('appear');
								observer.unobserve(entry.target);
							}
						});
					},
					{ threshold: 0.1 },
				);

				elements.forEach((element) => {
					observer.observe(element);
				});
			};

			animateElements();
		}

		// Clean up on component unmount
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<>
			{/* Hero Section */}
			<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 pt-20">
				<div className="absolute inset-0 z-0 bg-[url('/assets/images/dental-bg.jpg')] bg-cover bg-center opacity-10"></div>
				<div className="container mx-auto px-4 text-center">
					<h1 className="head_text green_gradient mb-4 animate-fade-in">
						SmileVillage
					</h1>
					<h2 className="head_text mb-8 animate-fade-in">
						Cabinet Stomatologic <br /> Dr. Roxana Dancea
					</h2>
					<p className="desc mx-auto mb-8 max-w-2xl animate-fade-in">
						Servicii stomatologice de calitate în Traian Vuia. Grijă și
						profesionalism pentru un zâmbet sănătos.
					</p>
					<div className="flex justify-center space-x-4">
						<a href="#despre-noi" className="btn-primary animate-fade-in">
							Despre noi
						</a>
						<a href="#contact" className="btn-outline animate-fade-in">
							Programare
						</a>
					</div>
				</div>
				<div className="absolute bottom-10 -translate-x-1/2 animate-bounce-slow">
					<a
						href="#despre-noi"
						className="flex flex-col items-center text-gray-500 hover:text-primary">
						<span className="mb-2 text-sm">Descoperă mai mult</span>
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
					</a>
				</div>
			</div>

			<div className="mx-auto w-11/12 max-w-6xl">
				<DespreNoi />
				<Servicii />
				<Galerie />
				<Contact />
			</div>

			{/* Scroll to top button */}
			<button
				id="scroll-to-top"
				onClick={scrollToTop}
				className="scroll-indicator"
				aria-label="Scroll to top">
				<ChevronUp className="h-6 w-6" />
			</button>
		</>
	);
};

export default Home;
