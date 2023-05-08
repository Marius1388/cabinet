import ScrollLink from './ScrollLink';

const Nav = () => {
	return (
		<nav className="flex-between w-full mb-16 pt-3">
			<ScrollLink href="#despre-noi">Despre noi</ScrollLink>
			<ScrollLink href="#servicii">Servicii</ScrollLink>
			<ScrollLink href="#galerie">Galerie</ScrollLink>
			<ScrollLink href="#smileDiaspora">Smile Diaspora</ScrollLink>
			<ScrollLink href="#contact">Contact</ScrollLink>
		</nav>
	);
};

export default Nav;
