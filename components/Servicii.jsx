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
				<div key={i}>
					<div className="flex items-center justify-between max-sm:flex-col md:flex-row">
						<p className="desc text-center font-semibold uppercase md:w-1/3">
							{item.name}
						</p>
						<p className="text-lg font-normal max-sm:text-justify md:w-2/3">
							{item.description}{' '}
						</p>
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
				</div>
			))}
		</StyledSection>
	);
};

export default Servicii;
