import React from 'react';
import StyledSection from './StyledSection';

const DespreNoi = () => {
	return (
		<StyledSection propId="despre-noi">
			<h2 className="green_gradient text-3xl font-bold">Despre noi</h2>
			<p className="desc mt-6 text-left indent-10 sm:text-justify">
				Absolventă a Facultății de Medicină Dentară din cadrul
				Universității de Medicină și Farmacie „Victor Babeș” din Timișoara
				și cu o experiență de 10 ani în domeniu, dr. Roxana Dancea
				administrează Cabinetul Stomatologic Traian Vuia, din județul
				Timiș, înființat în anul 2023, cu ajutorul fondurilor europene din
				„Programul Național de Dezvoltare Rurală” (PNDR). Cabinetul
				stomatologic din comuna Traian Vuia asigură servicii de endodonție
				(tratamente de canal), protetică (lucrări dentare, proteze),
				estetică și implantologie (prin clinicile partenere) și se
				adresează atât pacienților din comuna Traian Vuia, cât și
				pacienților din Țara Făgetului sau orice altă zonă a țării.
			</p>
		</StyledSection>
	);
};

export default DespreNoi;
