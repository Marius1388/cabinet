// o pagina home - detalii generale "despre noi"
// poze Cabinet stomatologic Traian Vuia
//  tratamente disponibile?!
//Smile Diaspora - pachetul de turism medical
//Contact -nr tel, adresa reala, adresa mail, adresa fb
//buton de contacteaza-ne

import DespreNoi from "@components/DespreNoi";
import Servicii from "@components/Servicii";
import Galerie from "@components/Galerie";
import SmileDiaspora from "@components/SmileDiaspora";
import Contact from "@components/Contact";

const Home = () => {
    return (
			<div className="my-20">
				<DespreNoi />
				<Servicii />
				<Galerie />
				<SmileDiaspora />
				<Contact />
			</div>
		);
};

export default Home;
