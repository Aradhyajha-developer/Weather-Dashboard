// Select HTML elements
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");

// Listen for form submit
form.addEventListener("submit", function (event) {

    // Prevent page refresh
    event.preventDefault();

    // Get input value
    const city = cityInput.value.trim();

    // Check if input is empty
    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    // Print city name in console
    console.log("City:", city);

});