// Select HTML elements
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");

// Replace with your API Key
const API_KEY = "1cdd85d183cd78fda3710a393fb6e45f";

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        console.log(data);

    } catch (error) {

        console.log("Error:", error);

    }

});