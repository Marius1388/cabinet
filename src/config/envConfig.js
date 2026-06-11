// Public client-side keys, baked into the bundle at build time by Vite.
// Locally: set them in .env.local — in CI: the deploy workflow writes them
// from GitHub secrets before `vite build`.
export function getGoogleMapsApiKey() {
	const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
	if (!key) {
		console.error('Google Maps API key not available');
	}
	return key || '';
}

export function getRecaptchaSiteKey() {
	const key = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
	if (!key) {
		console.error('reCAPTCHA site key not available');
	}
	return key || '';
}
