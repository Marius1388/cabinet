const StyledSection = ({ children, propId }) => {
	return (
		<section className="mb-10 w-full " id={propId}>
			<div className="h-96 w-full shadow-lg">
				<div>{children}</div>
			</div>
		</section>
	);
};

export default StyledSection;
