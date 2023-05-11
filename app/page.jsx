// o pagina home - detalii generale "despre noi"
// poze Cabinet stomatologic Traian Vuia
//  tratamente disponibile?!
//Smile Diaspora - pachetul de turism medical
//Contact -nr tel, adresa reala, adresa mail, adresa fb
//buton de contacteaza-ne

import DespreNoi from "@components/DespreNoi";
import Servicii from "@components/Servicii";
import Galerie from "@components/Galerie";
import SmileVillage from '@components/SmileVillage';
import Contact from '@components/Contact';

const Home = () => {
	return (
		<div className="my-20 w-5/6">
			<h1 className="head_text green_gradient pb-2 text-center">
				SmileVillage
			</h1>
			<h1 className="head_text text-center">
				Cabinet Stomatologic <br /> Dr. Roxana Dancea
			</h1>
			<DespreNoi />
			<Servicii />
			<Galerie />
			<SmileVillage />
			<Contact />
		</div>
	);
};

export default Home;
