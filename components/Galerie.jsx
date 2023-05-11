'use client';
import Carousel from 'react-material-ui-carousel';
import StyledSection from './StyledSection';
import { Paper } from '@mui/material';
import Image from 'next/image';
import img1 from '../public/assets/images/cabinet/1.jpg';
import img2 from '../public/assets/images/cabinet/2.jpg';
import img3 from '../public/assets/images/cabinet/3.jpg';
import img4 from '../public/assets/images/cabinet/4.jpg';
import img5 from '../public/assets/images/cabinet/5.jpg';
import img6 from '../public/assets/images/cabinet/6.jpg';

const Galerie = () => {
	const items = [
		{
			name: '#1',
			description: '1',
			src: img1,
		},
		{
			name: '#2',
			description: '2',
			src: img2,
		},
		{
			name: '#3',
			description: '3',
			src: img3,
		},
		{
			name: '#4',
			description: '4',
			src: img4,
		},
		{
			name: '#5',
			description: '5',
			src: img5,
		},
		{
			name: '#6',
			description: '6',
			src: img6,
		},
	];

	return (
		<StyledSection propId="galerie">
			<h2 className="green_gradient text-3xl font-bold ">Galerie</h2>
			<Carousel sx={{ boxShadow: 0 }}>
				{items.map((item, i) => {
					return (
						<Paper
							className="flex-grow-1 relative z-0 flex h-full items-center bg-transparent"
							sx={{ boxShadow: 0 }}
							key={i}>
							<Image
								src={item.src}
								alt={item.description}
								blurDataURL={item.src}
							/>
						</Paper>
					);
				})}
			</Carousel>
		</StyledSection>
	);
};

export default Galerie;
