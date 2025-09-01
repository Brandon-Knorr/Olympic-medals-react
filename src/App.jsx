import "./App.css";
import Country from "./components/Country";
import { useState } from "react";
import Medal from "./components/Medal";
import { useRef } from "react";

function App() {
	const [countries, setCountries] = useState([
		{
			id: 1,
			name: "United States",
			gold: 2,
		},
		{
			id: 2,
			name: "China",
			gold: 3,
		},
		{
			id: 3,
			name: "France",
			gold: 0,
		},
	]);

	const medals = useRef([
		{
			id: 1,
			name: "gold",
		},
		{
			id: 2,
			name: "silver",
		},
		{
			id: 3,
			name: "bronze",
		},
	]);

	function handleDelete(countryId) {
		console.log(`delete word: ${countryId}`);
		setCountries(countries.filter((c) => c.id !== countryId));
	}

	return (
		<>
			<h1>Welcome To My Olympic Medal App!</h1>
			{countries.map((country) => (
				<Country
					key={country.id}
					country={country}
					medals={medals.current}
					onDelete={handleDelete}
				/>
			))}
		</>
	);
}

export default App;
