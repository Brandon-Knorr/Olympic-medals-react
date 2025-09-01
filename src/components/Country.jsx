// import { useState } from "react";

import Medal from "./Medal";

function Country(props) {
	// const [text, setText] = useState("United States");
	// const [count, setCount] = useState(0);

	// function handleClick() {
	//     setCount((count) => count + 1);
	// }

	//MAKING THE CHANGES FOR THE SECOND ASSIGNMENT.

	return (
		<>
			{/* <h3>
                {text} : {count}{" "}
            </h3>
            <button onClick={handleClick}>+</button> */}

			<div className="country-card">
				<h4 className="country">
					<u>{props.country.name}</u>
				</h4>
				<Medal medals={props.medals} />
				<button onClick={() => props.onDelete(props.country.id)}>X</button>
			</div>
		</>
	);
}

export default Country;
