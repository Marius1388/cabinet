/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif'],
			},
			colors: {
				primary: {
					light: '#98fb98', // PaleGreen
					DEFAULT: '#3cb371', // MediumSeaGreen
					dark: '#2e8b57', // SeaGreen
				},
				accent: {
					DEFAULT: '#1e90ff', // DodgerBlue
				},
				gray: {
					50: '#f8f9fa',
					100: '#f1f3f5',
					200: '#e9ecef',
					300: '#dee2e6',
					400: '#ced4da',
					500: '#adb5bd',
					600: '#6c757d',
					700: '#495057',
					800: '#343a40',
					900: '#212529',
				},
			},
			boxShadow: {
				sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
				DEFAULT: '0 4px 6px rgba(0, 0, 0, 0.1)',
				md: '0 6px 10px rgba(0, 0, 0, 0.1)',
				lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
				xl: '0 15px 25px rgba(0, 0, 0, 0.1)',
				'2xl': '0 20px 40px rgba(0, 0, 0, 0.1)',
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-out forwards',
				'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
				'slide-in-right': 'slideInRight 0.5s ease-out forwards',
				'bounce-slow': 'bounce 3s infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				slideInLeft: {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				slideInRight: {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
			},
			transitionProperty: {
				height: 'height',
				spacing: 'margin, padding',
			},
			transitionDuration: {
				400: '400ms',
			},
		},
	},
	plugins: [],
};
