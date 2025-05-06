cat > (public / runtime - config.js) << 'EOL';
window._env = {
	MAPS_API_KEY: '${{ secrets.GOOGLE_MAPS_API_KEY }}',
	RECAPTCHA_SITE_KEY: '${{ secrets.RECAPTCHA_SITE_KEY }}',
};
EOL;
