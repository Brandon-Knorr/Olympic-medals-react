import "./App.css";
import Country from "./components/Country";
import { useState } from "react";
import Medal from "./components/Medal";
import { useRef } from "react";

function App() {
	const [COUNTRIES, setCountries] = useState([
		{
			id: 1,
			name: "United States",
			gold: 2,
			silver: 2,
			bronze: 3,
		},
		{
			id: 2,
			name: "China",
			gold: 3,
			silver: 1,
			bronze: 0,
		},
		{
			id: 3,
			name: "France",
			gold: 0,
			silver: 2,
			bronze: 2,
		},
	]);

	const MEDALS = useRef([
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
		setCountries(COUNTRIES.filter((c) => c.id !== countryId));
	}

	function handleIncrement(countryId, medalName) {
		setCountries(
			COUNTRIES.map((country) =>
				country.id === countryId
					? { ...country, [medalName]: country[medalName] + 1 }
					: country
			)
		);
	}

	function handleDecrement(countryId, medalName) {
		setCountries(
			COUNTRIES.map((country) =>
				country.id === countryId
					? { ...country, [medalName]: country[medalName] - 1 }
					: country
			)
		);
	}

	//creating a function to get the total medals from all countries.

	function getGrandTotalMedals(COUNTRIES, MEDALS) {
		//takes in the countries and medals arrays
		return COUNTRIES.reduce(
			//goes over each country and keeps a running total of medals
			(total, country) =>
				total +
				//goes over each medal type within the country and gets a total of all medal types
				MEDALS.reduce((sum, medal) => sum + (country[medal.name] || 0), 0),
			0
		);
	}

	return (
		<>
			<h1>Welcome To My Olympic Medal App!</h1>

			<h3>
				Total Olympic Medals: {getGrandTotalMedals(COUNTRIES, MEDALS.current)}
			</h3>

			<div className="cards-container">
				{COUNTRIES.map((country) => (
					<Country
						key={country.id}
						country={country}
						MEDALS={MEDALS.current}
						onIncrement={handleIncrement}
						onDecrement={handleDecrement}
						onDelete={handleDelete}
					/>
				))}
			</div>

			<p>
				<small>By: Brandon Knorr | &copy;Brandon Knorr Dev | 2025</small>
			</p>
		</>
	);
}

export default App;
