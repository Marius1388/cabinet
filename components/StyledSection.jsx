'use client';
import React, { useEffect, useRef } from 'react';

const StyledSection = ({ children, propId, className = '' }) => {
	const sectionRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('appear');
						observer.unobserve(entry.target);
					}
				});
			},
			{
				root: null,
				rootMargin: '0px',
				threshold: 0.15,
			},
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
		};
	}, []);

	return (
		<section
			id={propId}
			ref={sectionRef}
			className={`fade-in mb-16 pt-16 ${className}`}>
			<div className="section-container">
				<div className="p-4">{children}</div>
			</div>
		</section>
	);
};

export default StyledSection;
