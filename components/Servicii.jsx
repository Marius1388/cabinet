import StyledSection from './StyledSection';

const list = [
	{
		name: 'endodontie',
		description: 'Tratamentul afectiunilor din interiorul dintelui',
	},
	{
		name: 'protetica dentara',
		description:
			'Inlocuirea dintilor lipsa sau reabilitarea orala complexa a arcadelor dentare',
	},
	{
		name: 'profilaxie',
		description:
			'O serie de proceduri stomatologice care se fac pentru a preveni apariția problemelor stomatologice (detartrajul, periajul profesional, depistarea cariilor incipiente și evaluarea obturațiilor, sigilarea șanțurilor și fosetelor, fluorizarea dinților)',
	},
	{
		name: 'albirea dentara',
		description:
			'Un procedeu prin care se redau dintilor ingalbeniti o culoare mai alba.',
	},
];

const Servicii = () => {
	return (
		<StyledSection propId="servicii">
			<h2 className="desc green_gradient font-bold uppercase ">Servicii</h2>
			{list.map((item, i) => (
				<div className="align-center flex">
					<p key={i} className="desc uppercase">
						{item.name}{' '}
					</p>
					<p>{item.description} </p>
				</div>
			))}
		</StyledSection>
	);
};

export default Servicii;
