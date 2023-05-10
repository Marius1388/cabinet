'use client';
import Carousel from 'react-material-ui-carousel';
import StyledSection from './StyledSection';
import { Paper } from '@mui/material';
import Image from 'next/image';
import img1 from '../public/assets/images/1.jpg';
import img2 from '../public/assets/images/2.jpg';
import img3 from '../public/assets/images/3.jpg';
import img4 from '../public/assets/images/4.jpg';

const Galerie = () => {
	const items = [
		{
			name: '#1',
			description: 'Probably the most random thing you have ever seen!',
			src: img1,
		},
		{
			name: '#2',
			description: 'Hello World!',
			src: img2,
		},
		{
			name: '#3',
			description: 'Hello World!',
			src: img3,
		},
		{
			name: '#4',
			description: 'Hello World!',
			src: img4,
		},
	];
	return (
		<StyledSection propId="galerie">
			<h1>Galerie</h1>
			<Carousel className="min-h-full " sx={{ boxShadow: 0 }}>
				{items.map((item, i) => (
					<Paper
						className="shadow-0 flex-grow-1 z-0 flex h-80 items-center bg-transparent"
						sx={{ boxShadow: 0 }}>
						<Image
							src={item.src}
							alt={item.description}
							layout="fill"
							objectFit="contain"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
						{/* <h2>{item.name}</h2>
						<p>{item.description}</p> */}
					</Paper>
				))}
			</Carousel>
		</StyledSection>
	);
};

export default Galerie;
