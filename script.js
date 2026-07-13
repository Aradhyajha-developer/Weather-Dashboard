// ======================================
// WEATHER DASHBOARD
// PART 1
// ======================================

// ==========================
// DOM ELEMENTS
// ==========================

const form = document.getElementById("weather-form");

const cityInput = document.getElementById("city");

const output = document.getElementById("output");

const locationBtn = document.getElementById("location-btn");

const themeBtn = document.getElementById("theme-btn");

const historyList = document.getElementById("history-list");

const forecastContainer =
document.getElementById("forecast-container");

const currentDate =
document.getElementById("current-date");

const currentTime =
document.getElementById("current-time");

// ==========================
// API
// ==========================

const API_KEY = "1cdd85d183cd78fda3710a393fb6e45f";

// ==========================
// LOCAL STORAGE
// ==========================

let searchHistory =
JSON.parse(localStorage.getItem("history")) || [];

// ==========================
// DATE & TIME
// ==========================

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

// ==========================
// DARK MODE
// ==========================

const savedTheme =
localStorage.getItem("theme");

if(savedTheme==="dark"){

document.body.classList.add("dark");

themeBtn.innerHTML =
'<i class="fa-solid fa-sun"></i>';

}

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

localStorage.setItem("theme","dark");

themeBtn.innerHTML =
'<i class="fa-solid fa-sun"></i>';

}else{

localStorage.setItem("theme","light");

themeBtn.innerHTML =
'<i class="fa-solid fa-moon"></i>';

}

});

// ==========================
// LOADING
// ==========================

function showLoading(){

output.innerHTML=`

<div class="loading">

<i class="fa-solid fa-spinner"></i>

<h2>Loading...</h2>

<p>

Fetching latest weather information...

</p>

</div>

`;

}

// ==========================
// ERROR
// ==========================

function showError(message){

output.innerHTML=`

<div class="error-card">

<i class="fa-solid fa-circle-exclamation"></i>

<h2>Oops!</h2>

<p>${message}</p>

</div>

`;

}

// ==========================
// HISTORY
// ==========================

function renderHistory(){

historyList.innerHTML="";

if(searchHistory.length===0){

historyList.innerHTML=

`<p class="empty-history">

No Recent Searches

</p>`;

return;

}

searchHistory.forEach(city=>{

const button =
document.createElement("button");

button.className="history-chip";

button.textContent=city;

button.addEventListener("click",()=>{

fetchWeather(city);

});

historyList.appendChild(button);

});

}

// ==========================
// SAVE HISTORY
// ==========================

function saveHistory(city){

city =
city.charAt(0).toUpperCase() +
city.slice(1).toLowerCase();

searchHistory =
searchHistory.filter(

item=>item.toLowerCase()!==city.toLowerCase()

);

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
// WEATHER DASHBOARD
// PART 2
// ======================================

// ==========================
// DISPLAY CURRENT WEATHER
// ==========================

function displayWeather(data){

const sunrise =
new Date(data.sys.sunrise*1000)
.toLocaleTimeString("en-IN",{

hour:"2-digit",

minute:"2-digit"

});

const sunset =
new Date(data.sys.sunset*1000)
.toLocaleTimeString("en-IN",{

hour:"2-digit",

minute:"2-digit"

});

output.innerHTML = `

<section class="weather-card">

<div class="weather-top">

<div class="weather-icon">

<img
src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png"
alt="Weather">

</div>

<div class="weather-main">

<h2>${data.name}, ${data.sys.country}</h2>

<p>${data.weather[0].description}</p>

<h1>${Math.round(data.main.temp)}°C</h1>

<p id="feels-like">

Feels Like ${Math.round(data.main.feels_like)}°C

</p>

</div>

</div>

<div class="high-low">

<div>

<span>High</span>

<h3>${Math.round(data.main.temp_max)}°C</h3>

</div>

<div>

<span>Low</span>

<h3>${Math.round(data.main.temp_min)}°C</h3>

</div>

</div>

<div class="weather-details">

<div class="detail-card">

<i class="fa-solid fa-droplet"></i>

<h4>Humidity</h4>

<p>${data.main.humidity}%</p>

</div>

<div class="detail-card">

<i class="fa-solid fa-wind"></i>

<h4>Wind</h4>

<p>${data.wind.speed} m/s</p>

</div>

<div class="detail-card">

<i class="fa-solid fa-eye"></i>

<h4>Visibility</h4>

<p>${(data.visibility/1000).toFixed(1)} km</p>

</div>

<div class="detail-card">

<i class="fa-solid fa-sun"></i>

<h4>Sunrise</h4>

<p>${sunrise}</p>

</div>

<div class="detail-card">

<i class="fa-solid fa-moon"></i>

<h4>Sunset</h4>

<p>${sunset}</p>

</div>

<div class="detail-card">

<i class="fa-solid fa-gauge-high"></i>

<h4>Pressure</h4>

<p>${data.main.pressure} hPa</p>

</div>

</div>

</section>

<section class="forecast-section">

<div class="section-title">

<h2>

<i class="fa-solid fa-calendar-days"></i>

5 Day Forecast

</h2>

</div>

<div id="forecast-container">

</div>

</section>

`;

}

// ==========================
// DISPLAY FORECAST
// ==========================

function displayForecast(data){

const forecastContainer =
document.getElementById("forecast-container");

forecastContainer.innerHTML="";

const dailyForecast=[];

data.list.forEach(item=>{

if(item.dt_txt.includes("12:00:00")){

dailyForecast.push(item);

}

});

dailyForecast.forEach(day=>{

const card=document.createElement("div");

card.className="forecast-card";

const date=
new Date(day.dt_txt);

card.innerHTML=`

<h3>

${date.toLocaleDateString("en-IN",{

weekday:"short"

})}

</h3>

<img
src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
alt="Icon">

<p>

${Math.round(day.main.temp)}°C

</p>

<p>

${day.weather[0].main}

</p>

`;

forecastContainer.appendChild(card);

});

}

// ==========================
// FETCH WEATHER
// ==========================

async function fetchWeather(city){

showLoading();

try{

const response=
await fetch(

`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`

);

if(!response.ok){

throw new Error("City not found.");

}

const data=
await response.json();

displayWeather(data);

saveHistory(data.name);

fetchForecast(data.name);

cityInput.value="";

}catch(error){

showError(error.message);

}

}

// ==========================
// FETCH FORECAST
// ==========================

async function fetchForecast(city){

try{

const response=
await fetch(

`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`

);

const data=
await response.json();

displayForecast(data);

}catch(error){

console.log(error);

}

}

// ==========================
// FETCH LOCATION WEATHER
// ==========================

async function fetchWeatherByLocation(lat,lon){

showLoading();

try{

const response=
await fetch(

`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`

);

if(!response.ok){

throw new Error("Unable to fetch weather.");

}

const data=
await response.json();

displayWeather(data);

saveHistory(data.name);

fetchForecast(data.name);

}catch(error){

showError(error.message);

}

}
// ======================================
// WEATHER DASHBOARD
// PART 3
// ======================================

// ==========================
// SEARCH FORM
// ==========================

form.addEventListener("submit",(event)=>{

event.preventDefault();

const city=cityInput.value.trim();

if(city.length<2){

showError("Please enter a valid city name.");

return;

}

fetchWeather(city);

});

// ==========================
// ENTER KEY SUPPORT
// ==========================

cityInput.addEventListener("keydown",(event)=>{

if(event.key==="Enter"){

event.preventDefault();

form.dispatchEvent(new Event("submit"));

}

});

// ==========================
// CURRENT LOCATION
// ==========================

locationBtn.addEventListener("click",()=>{

if(!navigator.geolocation){

showError(

"Geolocation is not supported by your browser."

);

return;

}

showLoading();

navigator.geolocation.getCurrentPosition(

(position)=>{

const latitude=position.coords.latitude;

const longitude=position.coords.longitude;

fetchWeatherByLocation(latitude,longitude);

},

(error)=>{

switch(error.code){

case error.PERMISSION_DENIED:

showError(

"Location permission denied."

);

break;

case error.POSITION_UNAVAILABLE:

showError(

"Location unavailable."

);

break;

case error.TIMEOUT:

showError(

"Location request timed out."

);

break;

default:

showError(

"Unable to fetch your location."

);

}

}

);

});

// ==========================
// AUTO FOCUS
// ==========================

cityInput.focus();

// ==========================
// RENDER HISTORY
// ==========================

renderHistory();

// ==========================
// LOAD LAST SEARCH
// ==========================

if(searchHistory.length>0){

fetchWeather(searchHistory[0]);

}else{

output.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-cloud-sun"></i>

<h2>

Search Any City

</h2>

<p>

Search for any city or use your current location
to view the latest weather information.

</p>

</div>

`;

}

// ==========================
// KEYBOARD SHORTCUT
// "/" focuses search box
// ==========================

document.addEventListener("keydown",(event)=>{

if(event.key==="/"){

event.preventDefault();

cityInput.focus();

}

});

// ==========================
// ONLINE / OFFLINE
// ==========================

window.addEventListener("offline",()=>{

showError(

"No Internet Connection."

);

});

window.addEventListener("online",()=>{

if(searchHistory.length>0){

fetchWeather(searchHistory[0]);

}

});

// ==========================
// PAGE LOADED
// ==========================

window.addEventListener("load",()=>{

console.log(

"Weather Dashboard Loaded Successfully"

);

});

// ======================================
// END OF SCRIPT
// ======================================