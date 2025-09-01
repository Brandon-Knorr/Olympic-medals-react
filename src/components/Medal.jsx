function Medal({ medals }) {
	return (
		<>
			<div>
				{medals.map((medal) => (
					<p key={medal.id}> {medal.name}: </p>
				))}
			</div>
		</>
	);
}

export default Medal;
