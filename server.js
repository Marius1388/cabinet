require('dotenv').config({ path: '.env.local' });
const { parse } = require('url');
const next = require('next');
const express = require('express'); // Add Express
const bodyParser = require('body-parser');
const contactHandler = require('./app/api/contact/route');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
	const server = express();

	server.use(bodyParser.json());
	server.use(bodyParser.urlencoded({ extended: true }));

	server.post('/api/contact', async (req, res) => {
		try {
			await contactHandler.POST(req, res);
		} catch (err) {
			console.error('Error occurred handling /api/contact', err);
			res.status(500).json({ error: 'Internal server error' });
		}
	});

	server.all('*', (req, res) => {
		const parsedUrl = parse(req.url, true);
		return handle(req, res, parsedUrl);
	});

	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});
