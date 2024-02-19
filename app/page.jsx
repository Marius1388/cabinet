import React from 'react';

import DespreNoi from '@components/DespreNoi';
import Servicii from '@components/Servicii';
import Galerie from '@components/Galerie';
import Contact from '@components/Contact';

const Home = () => {
	return (
		<div className="my-20 w-5/6 max-sm:w-11/12">
			<h1 className="head_text green_gradient pb-2 text-center">
				SmileVillage
			</h1>
			<h1 className="head_text text-center">
				Cabinet Stomatologic <br /> Dr. Roxana Dancea
			</h1>
			<DespreNoi />
			<Servicii />
			<Galerie />
			<Contact />
		</div>
	);
};

export default Home;
