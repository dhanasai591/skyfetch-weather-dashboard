const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

// Your OpenWeatherMap API Key
const API_KEY = "e41d4f9aa64e6bf1fc95e8050b71ae1b"; // Replace with your actual API key
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Function to fetch weather data
async function getWeather(city) {
  showLoading();

  const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

  // Disable button
  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  try {
    const response = await axios.get(url);
    displayWeather(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      showError("City not found. Please check the spelling.");
    } else {
      showError("Something went wrong. Please try again.");
    }
  } finally {
    // Always re-enable button
    searchBtn.disabled = false;
    searchBtn.textContent = "🔍 Search";
  }
}

function showError(message) {
  const errorHTML = `
    <div class="error-message">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Weather Unavailable</h3>
        <p class="error-text">${message}</p>
    </div>
  `;

  document.getElementById("weather-display").innerHTML = errorHTML;
}

function handleSearch() {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  if (city.length < 2) {
    showError("City name is too short.");
    return;
  }

  getWeather(city);
}

// Click event
searchBtn.addEventListener("click", handleSearch);

// Enter key support
cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

// Function to display weather data
function displayWeather(data) {
  const cityName = data.name;
  const temperature = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const weatherHTML = `
    <div class="weather-info">
      <h2 class="city-name">${cityName}</h2>
      <img src="${iconUrl}" alt="${description}" class="weather-icon">
      <div class="temperature">${temperature}°C</div>
      <p class="description">${description}</p>
    </div>
  `;

  document.getElementById("weather-display").innerHTML = weatherHTML;

  // Focus input for fast repeat searches
  cityInput.focus();
}

function showLoading() {
  const loadingHTML = `
    <div class="loading-container">
        <div class="spinner"></div>
        <p>Fetching weather data...</p>
    </div>
  `;

  document.getElementById("weather-display").innerHTML = loadingHTML;
}

document.getElementById("weather-display").innerHTML = `
  <div class="welcome-message">
    <h3>🌍 Welcome to SkyFetch</h3>
    <p>Enter a city name to get started!</p>
  </div>
`;