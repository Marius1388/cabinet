/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: '.next',
	compiler: {
		removeConsole: {
			exclude: ['log'],
		},
	},
};

module.exports = nextConfig
