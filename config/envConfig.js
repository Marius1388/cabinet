// config/envConfig.js

// This approach loads API keys from environment variables at runtime,
// but provides fallbacks for when environment variables fail in production
export function getGoogleMapsApiKey() {
	// First try environment variable
	if (process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY) {
		return process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY;
	}

	// For production fallback, retrieve from window object if set
	if (
		typeof window !== 'undefined' &&
		window._env &&
		window._env.MAPS_API_KEY
	) {
		return window._env.MAPS_API_KEY;
	}

	// Log the issue but don't provide an actual key
	console.error('Google Maps API key not available');
	return '';
}

export function getRecaptchaSiteKey() {
	// First try environment variable
	if (process.env.NEXT_PUBLIC_LOCALHOST_RECAPTCHA_SITE_KEY) {
		return process.env.NEXT_PUBLIC_LOCALHOST_RECAPTCHA_SITE_KEY;
	}

	// For production fallback, retrieve from window object if set
	if (
		typeof window !== 'undefined' &&
		window._env &&
		window._env.RECAPTCHA_SITE_KEY
	) {
		return window._env.RECAPTCHA_SITE_KEY;
	}

	// Log the issue but don't provide an actual key
	console.error('reCAPTCHA site key not available');
	return '';
}
