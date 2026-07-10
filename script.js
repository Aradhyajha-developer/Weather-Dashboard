console.log("JavaScript Connected");

// Select HTML elements
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const output = document.getElementById("output");
const locationBtn = document.getElementById("location-btn");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");

// OpenWeather API Key
const API_KEY = "1cdd85d183cd78fda3710a393fb6e45f";


function saveSearch(city) {

    let history = JSON.parse(localStorage.getItem("history")) || [];

    if (!history.includes(city)) {
        history.unshift(city);
    }

    history = history.slice(0, 5);

    localStorage.setItem("history", JSON.stringify(history));

    showHistory();
}

function showHistory() {

    historyList.innerHTML = "";

    const history = JSON.parse(localStorage.getItem("history")) || [];

    if (history.length === 0) {

        historyList.innerHTML = `
            <li>No recent searches</li>
        `;

        return;
    }

    history.forEach(city => {

        historyList.innerHTML += `
            <li>${city}</li>
        `;

    });

}
// Function to display weather
function displayWeather(data) {
    output.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>

        <p><strong>🌡 Temperature:</strong> ${data.main.temp} °C</p>

        <p><strong>☁ Weather:</strong> ${data.weather[0].main}</p>

        <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>

        <p><strong>💨 Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
}

// =========================
// Search by City
// =========================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    output.innerHTML = `
        <div class="loading">
            ⏳ Loading Weather...
        </div>
    `;

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found!");
        }

        const data = await response.json();

        displayWeather(data);
        saveSearch(data.name);

    } catch (error) {

        output.innerHTML = `
            <div class="error-box">
                <h3>❌ Oops!</h3>
                <p>${error.message}</p>
            </div>
        `;

    }

});

// =========================
// Use My Location
// =========================

locationBtn.addEventListener("click", function () {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported in your browser.");
        return;
    }

    output.innerHTML = `
        <div class="loading">
            📍 Getting your location...
        </div>
    `;

    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                );

                if (!response.ok) {
                    throw new Error("Unable to fetch weather.");
                }

                const data = await response.json();

                displayWeather(data);
                saveSearch(data.name);

            } catch (error) {

                output.innerHTML = `
                    <div class="error-box">
                        <h3>❌ Error</h3>
                        <p>${error.message}</p>
                    </div>
                `;

            }

        },

        function () {

            output.innerHTML = `
                <div class="error-box">
                    <h3>📍 Permission Denied</h3>
                    <p>Please allow location access.</p>
                </div>
            `;

        }

    );

});
showHistory();
clearHistoryBtn.addEventListener("click", function () {

    localStorage.removeItem("history");

    showHistory();

});