import "./App.css";
import Country from "./components/Country";
import { useState } from "react";

function App() {
	const [countries, setCountries] = useState([
		{ id: 1, name: "United States", gold: 2 },
		{ id: 2, name: "China", gold: 3 },
		{ id: 3, name: "France", gold: 0 },
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
					onDelete={handleDelete}
				/>
			))}
		</>
	);
}

export default App;
