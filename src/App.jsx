import "./App.css";
import Country from "./components/Country";
import { useState } from "react";
import Medal from "./components/Medal";
import { useRef } from "react";
import NewCountry from "./components/NewCountry";

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

	//creating a function to add a country to the apps main page
	function handleAddCountry(name) {
		const trimmed = name.trim();
		if (trimmed.length === 0) {
			return;
		}

		//here we set the new country to the list of existing countries
		// giving it a brand new id that is 1 more than the greatest current id
		setCountries([
			...COUNTRIES,
			{
				id:
					COUNTRIES.length > 0
						? Math.max(...COUNTRIES.map((c) => c.id)) + 1
						: 1,
				name: trimmed,
				gold: 0,
				silver: 0,
				bronze: 0,
			},
		]);
	}

	return (
		<>
			<div className="app">
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

				<NewCountry onAdd={handleAddCountry} />

				<div className="footer-container">
					<p>
						<small>By: Brandon Knorr | &copy;Brandon Knorr Dev | 2025</small>
					</p>
				</div>
			</div>
		</>
	);
}

export default App;
