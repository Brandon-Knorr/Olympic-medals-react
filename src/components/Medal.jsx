function Medal({ medals, country, onDecrement, onIncrement }) {
	return (
		<>
			<div>
				{medals.map((medal) => (
					<p key={medal.id}>
						<b>
							{medal.name}: {country[medal.name]}
						</b>
						<button
							className="medal-btn increment"
							onClick={() => onIncrement(country.id, medal.name)}
						>
							+
						</button>
						<button
							className="medal-btn decrement"
							onClick={() => onDecrement(country.id, medal.name)}
							disabled={country[medal.name] === 0}
						>
							-
						</button>
					</p>
				))}
			</div>
		</>
	);
}

export default Medal;
