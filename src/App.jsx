import "./App.css";
import Country from "./components/Country";
import { useState, useEffect, useRef } from "react";
import NewCountry from "./components/NewCountry";

const API_URL = "http://localhost:5112/api/country";

function App() {
	const [countries, setCountries] = useState([]);

	const MEDALS = useRef([
		{ id: 1, name: "gold" },
		{ id: 2, name: "silver" },
		{ id: 3, name: "bronze" },
	]);

	useEffect(() => {
		fetch(API_URL)
			.then((res) => {
				if (!res.ok) {
					throw new Error("Network response was not ok");
				}
				return res.json();
			})
			.then((data) => setCountries(data))
			.catch((error) => console.error("Fetch error:", error));
	}, []);

	const handleUpdate = (countryId, updatedCountry) => {
		fetch(`${API_URL}/${countryId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatedCountry),
		}).then((res) => {
			if (res.ok) {
				setCountries(
					countries.map((c) => (c.id === countryId ? updatedCountry : c))
				);
			}
		});
	};

	function handleIncrement(countryId, medalName) {
		const country = countries.find((c) => c.id === countryId);
		if (country) {
			handleUpdate(countryId, {
				...country,
				[medalName]: country[medalName] + 1,
			});
		}
	}

	function handleDecrement(countryId, medalName) {
		const country = countries.find((c) => c.id === countryId);
		if (country && country[medalName] > 0) {
			handleUpdate(countryId, {
				...country,
				[medalName]: country[medalName] - 1,
			});
		}
	}

	function handleDelete(countryId) {
		fetch(`${API_URL}/${countryId}`, {
			method: "DELETE",
		}).then((res) => {
			if (res.ok) {
				setCountries(countries.filter((c) => c.id !== countryId));
			}
		});
	}

	function handleAddCountry(name) {
		const trimmed = name.trim();
		if (trimmed.length === 0) return;

		const newCountry = { name: trimmed, gold: 0, silver: 0, bronze: 0 };

		fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newCountry),
		})
			.then((res) => res.json())
			.then((data) => {
				setCountries([...countries, data]);
			});
	}

	function getGrandTotalMedals(countries, medals) {
		return countries.reduce(
			(total, country) =>
				total +
				medals.reduce((sum, medal) => sum + (country[medal.name] || 0), 0),
			0
		);
	}

	return (
		<div className="app">
			<h1>Welcome To My Olympic Medal App!</h1>
			<h3>
				Total Olympic Medals: {getGrandTotalMedals(countries, MEDALS.current)}
			</h3>
			<div className="cards-container">
				{countries.map((country) => (
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
	);
}

export default App;
