const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Determine environment
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;

// Create the Next.js app instance
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Prepare the Next.js application
app.prepare().then(() => {
	// Create HTTP server
	const server = createServer(async (req, res) => {
		try {
			// Add CORS headers for API routes
			if (req.url.startsWith('/api/')) {
				res.setHeader('Access-Control-Allow-Credentials', 'true');
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader(
					'Access-Control-Allow-Methods',
					'GET,OPTIONS,PATCH,DELETE,POST,PUT',
				);
				res.setHeader(
					'Access-Control-Allow-Headers',
					'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
				);

				// Handle preflight requests
				if (req.method === 'OPTIONS') {
					res.statusCode = 200;
					res.end();
					return;
				}
			}

			// Add cache control headers
			res.setHeader('Cache-Control', 'no-store, max-age=0');

			// Parse URL
			const parsedUrl = parse(req.url, true);

			// Let Next.js handle the request
			await handle(req, res, parsedUrl);
		} catch (err) {
			console.error('Server error:', err);
			res.statusCode = 500;
			res.end('Internal Server Error');
		}
	});

	// Start the server
	server.listen(port, (err) => {
		if (err) throw err;

		console.log(`> Ready on http://${hostname}:${port}`);
		console.log(`> Environment: ${dev ? 'development' : 'production'}`);
	});
});
