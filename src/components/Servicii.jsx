import React from 'react';
import StyledSection from './StyledSection';

const list = [
	{
		name: 'endodonție',
		description: 'Tratamentul afecțiunilor dintelui',
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
			<h2 className="green_gradient text-3xl font-bold">Servicii</h2>
			{list.map((item, i) => (
				<div key={i}>
					<div className="my-4 flex flex-col items-center gap-2 md:flex-row md:justify-between md:gap-6">
						<p className="desc text-center font-semibold uppercase md:w-1/3">
							{item.name}
						</p>
						<p className="text-left text-lg font-normal md:w-2/3">
							{item.description}
						</p>
					</div>
					{i < list.length - 1 && (
						<hr className="mx-auto h-0.5 w-[85%] border-0 bg-[var(--primary-light)]" />
					)}
				</div>
			))}
		</StyledSection>
	);
};

export default Servicii;
