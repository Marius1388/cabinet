'use client';
import React from 'react';
import PhoneIcon from '@mui/icons-material/Phone';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import Formular from '@components/Formular';
import StyledSection from './StyledSection';
import { getGoogleMapsApiKey } from '@/config/envConfig';

const Contact = () => {
	// Log API key status for debugging
	React.useEffect(() => {
		console.log(
			'Google Maps API Key Status:',
			getGoogleMapsApiKey() ? 'Available' : 'Missing',
		);
	}, []);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: getGoogleMapsApiKey(),
	});

	// Log any load errors
	React.useEffect(() => {
		if (loadError) console.error('Google Maps load error:', loadError);
	}, [loadError]);

	const center = { lat: 45.7974016, lng: 22.0669081 };

	return (
		<StyledSection propId="contact">
			<h2 className="green_gradient text-3xl font-bold">Contact</h2>
			<div className="mt-4 flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between">
				<div className="md:w-1/2">
					<p className="desc mt-3 text-center">
						Ne găsiți în Traian Vuia, DN 68A,
						<br /> nr. 31 &#128515;{' '}
					</p>
					<h1 className="mt-4 text-center text-xl font-bold">Program</h1>
					<p className="mt-2 text-center text-lg font-medium">
						Luni: 08.00-14.00
					</p>
					<p className="mt-2 text-center text-lg font-medium">
						Joi: 14.00-18.00
					</p>
					<p className="mt-4 text-center text-lg font-medium">
						<a
							href="tel:+40720894803"
							className="flex items-center justify-center gap-2 transition-colors hover:text-primary">
							<PhoneIcon /> +4 0720 894 803
						</a>
					</p>
					<p className="desc mt-4 text-center">
						Sună-ne! &#8593;
						<br />
						Sau trimite-ne un mesaj accesând
					</p>
					<div className="desc mt-2 flex flex-row flex-wrap items-center justify-center gap-2 text-center">
						<p>iconița &#8594;</p>
						<Formular />
					</div>
				</div>
				<div className="flex justify-center md:w-1/2">
					{loadError && (
						<div className="flex h-80 w-80 items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4">
							<p className="text-center text-red-600">
								Unable to load Google Maps. Please try again later.
							</p>
						</div>
					)}

					{!isLoaded && !loadError ? (
						<div className="flex h-80 w-80 items-center justify-center rounded-lg bg-gray-100">
							<p>Se încarcă harta...</p>
						</div>
					) : isLoaded && !loadError ? (
						<div className="h-80 w-80 overflow-hidden rounded-lg shadow-md">
							<GoogleMap
								mapContainerStyle={{
									width: '100%',
									height: '100%',
								}}
								center={center}
								zoom={14}
								options={{
									zoomControl: true,
									mapTypeControl: false,
									streetViewControl: false,
									fullscreenControl: true,
								}}>
								<Marker position={center} />
							</GoogleMap>
						</div>
					) : null}
				</div>
			</div>
		</StyledSection>
	);
};

export default Contact;
