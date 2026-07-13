// ======================================
// WEATHER DASHBOARD
// PART 1
// ======================================

// ---------- DOM ELEMENTS ----------

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const output = document.getElementById("output");
const locationBtn = document.getElementById("location-btn");
const historyList = document.getElementById("history-list");
const themeBtn = document.getElementById("theme-btn");

const currentDate = document.getElementById("current-date");
const currentTime = document.getElementById("current-time");

const weatherTip = document.getElementById("weather-tip");

// ---------- API ----------

const API_KEY = "1cdd85d183cd78fda3710a393fb6e45f";

// ---------- LOCAL STORAGE ----------

let searchHistory =
JSON.parse(localStorage.getItem("history")) || [];

// ---------- WEATHER TIPS ----------

const tips = [

"☀️ Stay hydrated during hot weather.",

"🌧 Carry an umbrella if rain is expected.",

"🧥 Wear warm clothes in cold weather.",

"🌬 Strong winds? Secure loose outdoor items.",

"🧴 Don't forget sunscreen on sunny days.",

"🚶 Perfect weather for a walk!"

];

// ======================================
// LIVE DATE & TIME
// ======================================

function updateDateTime(){

const now = new Date();

currentDate.textContent =
now.toLocaleDateString("en-IN",{

weekday:"long",

day:"numeric",

month:"long",

year:"numeric"

});

currentTime.textContent =
now.toLocaleTimeString("en-IN",{

hour:"2-digit",

minute:"2-digit",

second:"2-digit"

});

}

updateDateTime();

setInterval(updateDateTime,1000);

// ======================================
// RANDOM WEATHER TIP
// ======================================

function updateTip(){

const random =
Math.floor(Math.random()*tips.length);

weatherTip.textContent =
tips[random];

}

updateTip();

setInterval(updateTip,10000);

// ======================================
// DARK MODE
// ======================================

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

themeBtn.innerHTML =
'<i class="fa-solid fa-sun"></i>';

}else{

themeBtn.innerHTML =
'<i class="fa-solid fa-moon"></i>';

}

});

// ======================================
// LOADING UI
// ======================================

function showLoading(){

output.innerHTML = `

<div class="loading">

<i class="fa-solid fa-spinner"></i>

<h2>Loading...</h2>

<p>Fetching latest weather data.</p>

</div>

`;

}

// ======================================
// ERROR UI
// ======================================

function showError(message){

output.innerHTML = `

<div class="error-card">

<i class="fa-solid fa-circle-exclamation"></i>

<h2>Oops!</h2>

<p>${message}</p>

</div>

`;

}// ======================================
// PART 2
// WEATHER FUNCTIONS
// ======================================

// ---------- DISPLAY WEATHER ----------

function displayWeather(data){

const sunrise =
new Date(data.sys.sunrise * 1000)
.toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
});

const sunset =
new Date(data.sys.sunset * 1000)
.toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
});

output.innerHTML = `

<div class="weather-card">

<div class="weather-top">

<div class="city-info">

<h2>${data.name}, ${data.sys.country}</h2>

<p>${new Date().toDateString()}</p>

</div>

<div class="weather-icon">

<img
src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png"
alt="Weather Icon">

<h3>${data.weather[0].main}</h3>

</div>

</div>


<div class="temperature">

<h1>${Math.round(data.main.temp)}°C</h1>

<span>
Feels Like
${Math.round(data.main.feels_like)}°C
</span>

</div>


<div class="weather-grid">

<div class="info-card">

<i class="fa-solid fa-temperature-half"></i>

<div>

<h4>Temperature</h4>

<p>${data.main.temp} °C</p>

</div>

</div>


<div class="info-card">

<i class="fa-solid fa-droplet"></i>

<div>

<h4>Humidity</h4>

<p>${data.main.humidity}%</p>

</div>

</div>


<div class="info-card">

<i class="fa-solid fa-wind"></i>

<div>

<h4>Wind Speed</h4>

<p>${data.wind.speed} m/s</p>

</div>

</div>


<div class="info-card">

<i class="fa-solid fa-eye"></i>

<div>

<h4>Visibility</h4>

<p>${data.visibility/1000} km</p>

</div>

</div>


<div class="info-card">

<i class="fa-solid fa-sun"></i>

<div>

<h4>Sunrise</h4>

<p>${sunrise}</p>

</div>

</div>


<div class="info-card">

<i class="fa-solid fa-moon"></i>

<div>

<h4>Sunset</h4>

<p>${sunset}</p>

</div>

</div>

</div>

</div>

`;

}

// ======================================
// HISTORY
// ======================================

function renderHistory(){

historyList.innerHTML="";

searchHistory.forEach(city=>{

const chip=document.createElement("button");

chip.className="history-chip";

chip.textContent=city;

chip.addEventListener("click",()=>{

fetchWeather(city);

});

historyList.appendChild(chip);

});

}

// ======================================
// SAVE HISTORY
// ======================================

function saveHistory(city){

city =
city.charAt(0).toUpperCase() +
city.slice(1).toLowerCase();

searchHistory =
searchHistory.filter(item=>item!==city);

searchHistory.unshift(city);

if(searchHistory.length>5){

searchHistory.pop();

}

localStorage.setItem(
"history",
JSON.stringify(searchHistory)
);

renderHistory();

}

// ======================================
// FETCH BY CITY
// ======================================

async function fetchWeather(city){

showLoading();

try{

const response = await fetch(

`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

);

if(!response.ok){

throw new Error("City not found.");

}

const data = await response.json();

displayWeather(data);

saveHistory(data.name);

cityInput.value="";

}catch(error){

showError(error.message);

}

}

// ======================================
// FETCH BY LOCATION
// ======================================

async function fetchWeatherByLocation(lat,lon){

showLoading();

try{

const response = await fetch(

`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

);

if(!response.ok){

throw new Error("Unable to fetch weather.");

}

const data = await response.json();

displayWeather(data);

saveHistory(data.name);

}catch(error){

showError(error.message);

}

}// ======================================
// PART 3
// EVENT LISTENERS & INITIALIZATION
// ======================================

// ---------- SEARCH FORM ----------

form.addEventListener("submit", (event) => {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {

        showError("Please enter a city name.");

        return;

    }

    fetchWeather(city);

});

// ---------- CURRENT LOCATION ----------

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        showError("Geolocation is not supported by your browser.");

        return;

    }

    showLoading();

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude = position.coords.latitude;

            const longitude = position.coords.longitude;

            fetchWeatherByLocation(latitude, longitude);

        },

        () => {

            showError("Location access denied.");

        }

    );

});

// ======================================
// ENTER KEY SUPPORT
// ======================================

cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        event.preventDefault();

        form.dispatchEvent(new Event("submit"));

    }

});

// ======================================
// INITIALIZE SEARCH HISTORY
// ======================================

renderHistory();

// ======================================
// DEFAULT EMPTY SCREEN
// ======================================

if (searchHistory.length === 0) {

    output.innerHTML = `

    <div class="empty-state">

        <i class="fa-solid fa-cloud-sun"></i>

        <h2>Welcome!</h2>

        <p>

            Search for a city or use your current location to view the latest weather forecast.

        </p>

    </div>

    `;

}

// ======================================
// LOAD LAST SEARCH (Optional)
// ======================================

if (searchHistory.length > 0) {

    fetchWeather(searchHistory[0]);

}

// ======================================
// END OF SCRIPT
// ======================================