// import { useState } from "react";

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

			<h4 className="country">
				<u>{props.country.name}</u>
			</h4>
			<h4 className="country">{props.country.gold}</h4>
			<button onClick={() => props.onDelete(props.country.id)}>X</button>
		</>
	);
}

export default Country;
