console.log("JavaScript Connected");

// Select HTML elements
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const output = document.getElementById("output");

// OpenWeather API Key
const API_KEY = "1cdd85d183cd78fda3710a393fb6e45f";

// Form Submit Event
form.addEventListener("submit", async function (event) {

    // Prevent page refresh
    event.preventDefault();

    // Get city name
    const city = cityInput.value.trim();

    // Check empty input
    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    // Loading message
    output.innerHTML = "<p>Loading weather...</p>";

    try {

        // Fetch weather data
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        // Check city exists or not
        if (!response.ok) {
            throw new Error("City not found!");
        }

        // Convert response into JSON
        const data = await response.json();

        console.log(data);

        // Display weather on webpage
        output.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>

            <p><strong>🌡 Temperature:</strong> ${data.main.temp} °C</p>

            <p><strong>☁ Weather:</strong> ${data.weather[0].main}</p>

            <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>

            <p><strong>💨 Wind Speed:</strong> ${data.wind.speed} m/s</p>
        `;

    } catch (error) {

        output.innerHTML = `
            <p style="color:red;">
                ${error.message}
            </p>
        `;

        console.log(error);

    }

});