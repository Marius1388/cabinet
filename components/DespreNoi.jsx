import StyledSection from './StyledSection';

const DespreNoi = () => {
	return (
		<section className="flex-center w-full flex-col">
			<StyledSection propId="despre-noi">
				<p className="desc mt-10  text-justify indent-10">
					Traian Vuia a fost un inventator român, pionier al aviației
					mondiale. În data de 18 martie 1906, a realizat unul din primele
					zboruri autopropulsate (fără catapulte sau alte mijloace
					exterioare) cu un aparat mai greu decât aerul.
				</p>
				<p className="desc text-justify indent-10 font-semibold">
					Noi am deschis primul cabinet stomatologic în satul natal al lui
					Traian Vuia.
				</p>
			</StyledSection>
		</section>
	);
};

export default DespreNoi;
