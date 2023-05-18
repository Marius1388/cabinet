'use client';
import PhoneIcon from '@mui/icons-material/Phone';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import Formular from '@components/Formular';
import StyledSection from './StyledSection';

const Contact = () => {
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY,
	});
	const center = { lat: 45.7974016, lng: 22.0669081 };
	return (
		<StyledSection propId="contact">
			<h2 className="green_gradient text-3xl font-bold ">Contact</h2>
			<div className="mt-2 flex flex-col items-center justify-center md:flex-row md:justify-between ">
				<div className="md:w-1/2 ">
					<p className="desc mt-3 text-center">
						Ne găsiți în Traian Vuia, DN 68A,
						<br /> nr. 31 &#128515;{' '}
					</p>
					<h1 className="mt-3 text-center text-xl font-bold ">Program</h1>
					<p className="mt-2 text-center text-lg font-medium">
						Luni: 08.00-14.00
					</p>
					<p className="mt-2 text-center text-lg font-medium">
						Joi: 14.00-18.00
					</p>
					<p className="mt-2 text-center text-lg font-medium">
						<PhoneIcon /> +4 0720 894 803
					</p>
					<p className="desc text-center">
						Sună-ne! &#8593;
						<br />
						Sau trimite-ne un mesaj accesând
					</p>
					<div className="desc flex flex-row flex-wrap items-center justify-center text-center ">
						<p>iconița &#8594;</p>
						<Formular />
					</div>
				</div>
				<div className="md:w-1/2">
					{!isLoaded ? (
						<h1>Loading...</h1>
					) : (
						<div className="h-80 w-80">
							<GoogleMap
								mapContainerStyle={{
									margin: 'auto',
									width: '100%',
									height: '100%',
								}}
								center={center}
								zoom={14}>
								<Marker position={center} />
							</GoogleMap>
						</div>
					)}
				</div>
			</div>
		</StyledSection>
	);
};

export default Contact;
