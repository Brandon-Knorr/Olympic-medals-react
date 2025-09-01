// import { useState } from "react";

import Medal from "./Medal";

function Country(props) {
	// const [text, setText] = useState("United States");
	// const [count, setCount] = useState(0);

	// function handleClick() {
	//     setCount((count) => count + 1);
	// }

	//MAKING THE CHANGES FOR THE SECOND ASSIGNMENT.

	//MAKING CHANGES FOR LAB

	const TOTAL_MEDALS = props.MEDALS.reduce(
		(sum, medal) => sum + (props.country[medal.name] || 0),
		0
	);

	return (
		<>
			{/* <h3>
                {text} : {count}{" "}
            </h3>
            <button onClick={handleClick}>+</button> */}

			<div className="country-card">
				<button onClick={() => props.onDelete(props.country.id)}>X</button>
				<h4 className="country">{props.country.name}</h4>
				<Medal
					medals={props.MEDALS}
					country={props.country}
					onDecrement={props.onDecrement}
					onIncrement={props.onIncrement}
				/>
				<div className="total-medals">
					<h3>
						<small> Total Medals: {TOTAL_MEDALS} </small>
					</h3>
				</div>
			</div>
		</>
	);
}

export default Country;
