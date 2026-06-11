import React from 'react';
import Carousel from 'react-material-ui-carousel';
import StyledSection from './StyledSection';
import { Paper } from '@mui/material';

const items = [1, 2, 3, 4, 5, 6].map((n) => ({
	description: `Cabinet stomatologic — imagine ${n}`,
	src: `/assets/images/cabinet/${n}.jpg`,
}));

const Galerie = () => {
	return (
		<StyledSection propId="galerie">
			<h2 className="green_gradient text-3xl font-bold">Galerie</h2>
			<Carousel sx={{ boxShadow: 0 }}>
				{items.map((item, i) => {
					return (
						<Paper
							className="flex-grow-1 relative z-0 flex h-full items-center bg-transparent"
							sx={{ boxShadow: 0 }}
							key={i}>
							<img
								src={item.src}
								alt={item.description}
								loading="lazy"
								className="h-auto w-full rounded-lg object-cover"
							/>
						</Paper>
					);
				})}
			</Carousel>
		</StyledSection>
	);
};

export default Galerie;
