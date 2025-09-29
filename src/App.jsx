import "./App.css";
import Country from "./components/Country";
import { useState, useEffect, useRef } from "react";
import NewCountry from "./components/NewCountry";
import { HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";

const BASE_URL =
	"https://olympic-medal-backend-f2cqcsavebctf4ez.eastus-01.azurewebsites.net";
const API_ENDPOINT = `${BASE_URL}/Country/country`;
const HUB_ENDPOINT = `${BASE_URL}/medalsHub`;

function App() {
	const [connection, setConnection] = useState(null);
	const [countries, setCountries] = useState([]);

	const MEDALS = useRef([
		{ id: 1, name: "gold" },
		{ id: 2, name: "silver" },
		{ id: 3, name: "bronze" },
	]);

	const latestCountries = useRef(null);
	// latestCountries is a ref variable to countries (state)
	// this is needed to access state variable in useEffect w/o dependency
	latestCountries.current = countries;

	useEffect(() => {
		// initial data loaded here
		async function fetchCountries() {
			const { data: fetchedCountries } = await axios.get(API_ENDPOINT);
			// we need to save the original medal count values in state
			let newCountries = [];
			fetchedCountries.forEach((country) => {
				let newCountry = {
					id: country.id,
					name: country.name,
				};
				MEDALS.current.forEach((medal) => {
					const count = country[medal.name];
					// page_value is what is displayed on the web page
					// saved_value is what is saved to the database
					newCountry[medal.name] = { page_value: count, saved_value: count };
				});
				newCountries.push(newCountry);
			});
			setCountries(newCountries);
		}
		fetchCountries();

		// signalR
		const newConnection = new HubConnectionBuilder()
			.withUrl(HUB_ENDPOINT)
			.withAutomaticReconnect()
			.build();

		setConnection(newConnection);
	}, []);

	useEffect(() => {
		if (connection) {
			connection
				.start()
				.then(() => {
					console.log("Connected!");
					connection.on("ReceiveAddMessage", (country) => {
						console.log(`Add: ${country.name}`);

						let newCountry = {
							id: country.id,
							name: country.name,
						};
						MEDALS.current.forEach((medal) => {
							const count = country[medal.name];
							newCountry[medal.name] = {
								page_value: count,
								saved_value: count,
							};
						});
						// we need to use a reference to countries array here
						// since this useEffect has no dependeny on countries array - it is not in scope
						let mutableCountries = [...latestCountries.current];
						mutableCountries = mutableCountries.concat(newCountry);
						setCountries(mutableCountries);
					});
					connection.on("ReceiveDeleteMessage", (id) => {
						console.log(`Delete id: ${id}`);
						let mutableCountries = [...latestCountries.current];
						mutableCountries = mutableCountries.filter((c) => c.id !== id);
						setCountries(mutableCountries);
					});
					connection.on("ReceivePatchMessage", (country) => {
						console.log(`Patch: ${country.name}`);
						let updatedCountry = {
							id: country.id,
							name: country.name,
						};
						MEDALS.current.forEach((medal) => {
							const count = country[medal.name];
							updatedCountry[medal.name] = {
								page_value: count,
								saved_value: count,
							};
						});
						let mutableCountries = [...latestCountries.current];
						const idx = mutableCountries.findIndex((c) => c.id === country.id);
						mutableCountries[idx] = updatedCountry;

						setCountries(mutableCountries);
					});
				})

				.catch((e) => console.log("Connection failed: ", e));
		}
		// useEffect is dependent on changes to connection
	}, [connection]);

	// async function handleAdd(name) {
	// 	try {
	// 		await axios.post(apiEndpoint, { name: name });
	// 	} catch (ex) {
	// 		if (ex.response) {
	// 			console.log(ex.response);
	// 		} else {
	// 			console.log("Request failed");
	// 		}
	// 	}
	// 	console.log("ADD");
	// }

	async function handleMedalChange(countryId, medalName, change) {
		const originalCountries = [...countries];
		const country = countries.find((c) => c.id === countryId);
		if (!country) return;

		const newValue = country[medalName].page_value + change;
		if (newValue < 0) return; // Prevent medal counts from going below zero.

		// First, optimistically update the UI for a responsive feel.
		const updatedCountries = countries.map((c) => {
			if (c.id === countryId) {
				return { ...c, [medalName]: { ...c[medalName], page_value: newValue } };
			}
			return c;
		});
		setCountries(updatedCountries);

		// Next, create the JSON Patch payload the backend requires.
		const patchDoc = [
			{
				op: "replace",
				path: `/${medalName}`,
				value: newValue,
			},
		];

		try {
			// Finally, send the PATCH request to the server.
			await axios.patch(`${API_ENDPOINT}/${countryId}`, patchDoc, {
				headers: { "Content-Type": "application/json-patch+json" },
			});
		} catch (ex) {
			console.error("Failed to update medal count:", ex);
			// If the API call fails, revert the UI to its original state.
			setCountries(originalCountries);
		}
	}

	// const handleUpdate = (countryId, updatedCountry) => {
	// 	fetch(`${API_URL}/${countryId}`, {
	// 		method: "PUT",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify(updatedCountry),
	// 	}).then((res) => {
	// 		if (res.ok) {
	// 			setCountries(
	// 				countries.map((c) => (c.id === countryId ? updatedCountry : c))
	// 			);
	// 		}
	// 	});
	// };

	// function handleIncrement(countryId, medalName) {
	// 	const country = countries.find((c) => c.id === countryId);
	// 	if (country) {
	// 		handleUpdate(countryId, {
	// 			...country,
	// 			[medalName]: country[medalName] + 1,
	// 		});
	// 	}
	// }

	function handleIncrement(countryId, medalName) {
		handleMedalChange(countryId, medalName, 1);
	}

	// function handleDecrement(countryId, medalName) {
	// 	const country = countries.find((c) => c.id === countryId);
	// 	if (country && country[medalName] > 0) {
	// 		handleUpdate(countryId, {
	// 			...country,
	// 			[medalName]: country[medalName] - 1,
	// 		});
	// 	}
	// }

	function handleDecrement(countryId, medalName) {
		handleMedalChange(countryId, medalName, -1);
	}

	// function handleDelete(countryId) {
	// 	fetch(`${API_URL}/${countryId}`, {
	// 		method: "DELETE",
	// 	}).then((res) => {
	// 		if (res.ok) {
	// 			setCountries(countries.filter((c) => c.id !== countryId));
	// 		}
	// 	});
	// }

	async function handleDelete(countryId) {
		try {
			await axios.delete(`${API_ENDPOINT}/${countryId}`);
			// State update logic is handled by the SignalR message, so no local setCountries is needed.
		} catch (ex) {
			console.error("Failed to delete country:", ex);
			// Optionally, add logic here to revert state if the call fails.
		}
	}

	// function handleAddCountry(name) {
	// 	const trimmed = name.trim();
	// 	if (trimmed.length === 0) return;

	// 	const newCountry = { name: trimmed, gold: 0, silver: 0, bronze: 0 };

	// 	fetch(API_URL, {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify(newCountry),
	// 	})
	// 		.then((res) => res.json())
	// 		.then((data) => {
	// 			setCountries([...countries, data]);
	// 		});
	// }

	async function handleAddCountry(name) {
		const trimmed = name.trim();
		if (trimmed.length === 0) return;

		const newCountry = { name: trimmed, gold: 0, silver: 0, bronze: 0 };

		try {
			await axios.post(API_ENDPOINT, newCountry);
			// State update logic is handled by the SignalR message, so no local setCountries is needed.
		} catch (ex) {
			console.error("Failed to add country:", ex);
		}
	}

	// function getGrandTotalMedals(countries, medals) {
	// 	return countries.reduce(
	// 		(total, country) =>
	// 			total +
	// 			medals.reduce((sum, medal) => sum + (country[medal.name] || 0), 0),
	// 		0
	// 	);
	// }

	function getGrandTotalMedals(countries, medals) {
		return countries.reduce(
			(total, country) =>
				total +
				medals.reduce(
					(sum, medal) => sum + (country[medal.name]?.page_value || 0),
					0
				),
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
