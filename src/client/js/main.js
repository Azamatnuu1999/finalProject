function handleSubmit(event) {
	event.preventDefault();
	// check what text was put into the form field
	let formCity = document.getElementById("name").value;
	let days = document.getElementById("days").value;
	let howManyDays = Math.round((new Date(days).getTime() / (1000 * 60 * 60 * 24)) - (new Date().getTime() / (1000 * 60 * 60 * 24)))

	// Getting data from input
	let data = {
		theCity: formCity,
		theDays: days,
		theDaysLeft: howManyDays
	};
	fetch("http://localhost:8081/call", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	})
	.then((res) => res.json())
	.then(function (res) {
			console.log('res', res)
			updateUI(res)
	});
}

// Updating UI
// data, img, days
function updateUI(data) {
	let {destination, coordinates, weather, imageURL, howManyDays} = data;
	console.log('weather', weather)
	let {low_temp: lowTemp, high_temp: highTemp, weather: {icon: iconName}} = weather;
	let result = document.getElementById('result')
		result.innerHTML += `
	<div class='card'>
		<p>Destination: <b>${destination}</b></p>
		<p>Your city's coordinates: <br> ${coordinates}</p>
		<p>How many days are left: <b>${howManyDays}</b></p>
		<div class='temp'>
			<div>
				<img src="src/assets/icons/${iconName}.png">
			</div>
			<h4>Temperature: <br> Min : ${Math.round(lowTemp - 273.75)}°C <br> Max : ${Math.round(highTemp - 273.15)}°C</h4>
		</div>
		<img src="${imageURL[0]}" alt="${data.destionation}">
		<img src="${imageURL[1]}" alt="${data.destionation}">
	</div>
		`
}
export { handleSubmit };
