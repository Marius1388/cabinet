// Screenshot helper for design audits: captures each section of the
// single-page site at desktop and mobile widths using the local Chrome.
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const url = process.env.SHOT_URL || 'http://localhost:5174/';
const outDir = 'scripts/shots';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
	executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	headless: true,
});

const errors = [];
const sizes = [
	{ name: 'desktop', width: 1280, height: 800 },
	{ name: 'mobile', width: 390, height: 844 },
];
const sections = ['despre-noi', 'servicii', 'galerie', 'contact'];

for (const size of sizes) {
	const page = await browser.newPage({
		viewport: { width: size.width, height: size.height },
	});
	page.on('console', (msg) => {
		if (msg.type() === 'error') errors.push(`[${size.name}] ${msg.text()}`);
	});
	page.on('pageerror', (err) => errors.push(`[${size.name}] ${err.message}`));

	await page.goto(url, { waitUntil: 'networkidle' });
	await page.waitForTimeout(1500);

	await page.screenshot({ path: `${outDir}/${size.name}-hero.png` });

	for (const id of sections) {
		await page.evaluate((sel) => {
			document.getElementById(sel)?.scrollIntoView();
		}, id);
		await page.waitForTimeout(900);
		await page.screenshot({ path: `${outDir}/${size.name}-${id}.png` });
	}

	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
	await page.waitForTimeout(900);
	await page.screenshot({ path: `${outDir}/${size.name}-footer.png` });

	await page.close();
}

await browser.close();
console.log('Screenshots written to', outDir);
if (errors.length) {
	console.log('CONSOLE ERRORS:');
	for (const e of [...new Set(errors)]) console.log(' -', e);
} else {
	console.log('No console errors.');
}
