import StyledSection from './StyledSection';

const list = [
	{
		name: 'endodonție',
		description: 'Tratamentul afecțiunilor din interiorul dintelui',
	},
	{
		name: 'protetică dentară',
		description:
			'Înlocuirea dinților lipsă sau reabilitarea orală complexă a arcadelor dentare',
	},
	{
		name: 'profilaxie',
		description:
			'O serie de proceduri stomatologice care se fac pentru a preveni apariția problemelor stomatologice (detartrajul, periajul profesional, depistarea cariilor incipiente și evaluarea obturațiilor, sigilarea șanțurilor și fosetelor, fluorizarea dinților)',
	},
	{
		name: 'albirea dentară',
		description:
			'Un procedeu prin care se redau dinților îngălbeniți o culoare mai albă',
	},
];

const Servicii = () => {
	return (
		<StyledSection propId="servicii">
			<h2 className="green_gradient text-3xl font-bold ">Servicii</h2>
			{list.map((item, i) => (
				<>
					<div className="flex items-center justify-between">
						<p key={i} className="desc w-1/3 text-center uppercase">
							{item.name}
						</p>
						<p className="w-2/3">{item.description} </p>
					</div>
					<hr
						style={{
							background: 'lightgreen',
							color: 'lime',
							borderColor: 'lime',
							height: '2px',
							width: '85%',
							margin: '0 auto',
						}}
					/>
				</>
			))}
		</StyledSection>
	);
};

export default Servicii;
