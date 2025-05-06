/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: '.next',
	// Don't remove console logs in production
	compiler: {
		removeConsole: {
			exclude: ['log', 'error', 'warn'],
		},
	},
	// Don't use output: 'standalone' for cPanel
	// Add cache configuration to prevent cache-related issues
	headers: async () => {
		return [
			{
				// Apply to all routes
				source: '/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'no-store, max-age=0',
					},
				],
			},
			{
				// Apply to API routes
				source: '/api/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'no-store, no-cache, max-age=0, must-revalidate',
					},
				],
			},
		];
	},
	// Properly handle fonts and images
	images: {
		domains: ['localhost'],
		unoptimized: false, // Use Next.js image optimization
	},
};

module.exports = nextConfig;
