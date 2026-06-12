// retrieve all relevant elements
const searchForm = document.getElementById("search-city");
const cityInput = document.getElementById("city");
const searchBtn = document.querySelector(".search-btn");
const errorMessage = document.querySelector(".error-message");
const weatherContainer = document.querySelector(".display-container");
const weatherIcon = document.getElementById("weather-icon");
const weatherLocation = document.querySelector(".location");
const weatherTemperature = document.querySelector(".weather-temperature");
const weatherDescription = document.getElementById("description");
const weatherFeelsLike = document.getElementById("feels-like");
const statsContainer = document.querySelector(".stats-container");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const uvIndex = document.getElementById("uv-index");
const forecastContainer = document.querySelector(".forecast-container");
const forecastTag = document.querySelector(".forecast-tag");

// Task: Update this to geolocation function. If user declines geolocation request, show this.
weatherContainer.style.display = "none";
statsContainer.style.display = "none";
forecastTag.style.display = "none";

// Get coordinates for a city name
async function getCoordinates(city) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    );
    if (!response.ok) {
      throw new Error("There was an error in fetching data.");
    }
    const data = response.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }
}

// Fetch current weather and 5-day forecast
async function getWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&daily=uv_index_max&current=apparent_temperature`,
    );
    if (!response.ok) {
      throw new Error("There was an error in fetching data.");
    }
    const data = response.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }
}

// display the loading message and skeleton
const displayLoadingSkeleton = (cityName) => {
  let displaySkeleton = `
    <div class="skeleton-details">
            <p class="loading">Loading...</p>
            <p class="loading-description">Fetching weather data for <span>${cityName}</span></p>
    </div>
    `;
  let statsSkeleton = `
            <div class="skeleton-stats-item">
              <div class="skeleton-stat-tag"></div>
              <div class="skeleton-stat-value"></div>
            </div>
            <div class="skeleton-stats-item">
              <div class="skeleton-stat-tag"></div>
              <div class="skeleton-stat-value"></div>
            </div>
            <div class="skeleton-stats-item">
              <div class="skeleton-stat-tag"></div>
              <div class="skeleton-stat-value"></div>
            </div>
`;
  let forecastSkeleton = `
        <div class="skeleton-item">
            <div class="skeleton-date"></div>
            <div class="skeleton-icon"></div>
            <div class="skeleton-temperature">
              <div class="skeleton-highest"></div>
              <div class="skeleton-lowest"></div>
            </div>
        </div>
        <div class="skeleton-item">
            <div class="skeleton-date"></div>
            <div class="skeleton-icon"></div>
            <div class="skeleton-temperature">
              <div class="skeleton-highest"></div>
              <div class="skeleton-lowest"></div>
            </div>
        </div>
        <div class="skeleton-item">
            <div class="skeleton-date"></div>
            <div class="skeleton-icon"></div>
            <div class="skeleton-temperature">
              <div class="skeleton-highest"></div>
              <div class="skeleton-lowest"></div>
            </div>
        </div>
        <div class="skeleton-item">
            <div class="skeleton-date"></div>
            <div class="skeleton-icon"></div>
            <div class="skeleton-temperature">
              <div class="skeleton-highest"></div>
              <div class="skeleton-lowest"></div>
            </div>
        </div>
        <div class="skeleton-item">
            <div class="skeleton-date"></div>
            <div class="skeleton-icon"></div>
            <div class="skeleton-temperature">
              <div class="skeleton-highest"></div>
              <div class="skeleton-lowest"></div>
            </div>
        </div>
    `;
  weatherContainer.style.display = "block";
  statsContainer.style.display = "grid";
  forecastTag.style.display = "block";
  weatherContainer.innerHTML = displaySkeleton;
  statsContainer.innerHTML = statsSkeleton;
  forecastContainer.innerHTML = forecastSkeleton;
};

// Update the DOM with current weather data
const displayCurrentWeather = (data, cityName, country) => {
  const currentWeatherCode = data.current.weather_code;
  const weatherDescriptionAndCode = getWeatherDescription(currentWeatherCode);
  const currentTemperature = data.current.temperature_2m;
  const currentApparentTemperature = data.current.apparent_temperature;
  const currentHumidity = data.current.relative_humidity_2m;
  const currentWindSpeed = data.current.wind_speed_10m;
  const currentUVIndex = data.daily.uv_index_max[0];
  const uvDescription = getUVIndex(Math.round(currentUVIndex));

  // update DOM
  let displayDetails = `
        <div class="display-details">
            <div class="weather-icon" id="weather-icon">${weatherDescriptionAndCode.icon}</div>
            <p class="location">${cityName}, ${country}</p>
            <h1 class="weather-temperature">${Math.round(currentTemperature)}°C</h1>
            <p class="weather-description">
                <span id="description">${weatherDescriptionAndCode.desc}</span> · Feels like
                <span id="feels-like">${Math.round(currentApparentTemperature)}°C</span>
            </p>
        </div>
  `;
  let displayStats = `
            <div class="stats-item">
              <p class="stat-tag">Humidity</p>
              <p id="humidity" class="stat-value">${Math.round(currentHumidity)}%</p>
            </div>
            <div class="stats-item">
              <p class="stat-tag">Wind</p>
              <p id="wind" class="stat-value">${Math.round(currentWindSpeed)} km/h</p>
            </div>
            <div class="stats-item">
              <p class="stat-tag">UV Index</p>
              <p id="uv-index" class="stat-value">${uvDescription}</p>
            </div>
  `;
  weatherContainer.style.display = "block";
  statsContainer.style.display = "grid";
  weatherContainer.innerHTML = displayDetails;
  statsContainer.innerHTML = displayStats;
};
// Convert a WMO weather code to description and icon
const getWeatherDescription = (code) => {
  if (code === 0) {
    return { desc: "Clear sky", icon: "☀️" };
  } else if (code === 1 || code === 2 || code === 3) {
    return { desc: "Partly cloudy", icon: "⛅️" };
  } else if (code === 45 || code === 48) {
    return { desc: "Foggy", icon: "🌫️" };
  } else if (code === 51 || code === 53 || code === 55) {
    return { desc: "Drizzle", icon: "🌦️" };
  } else if (code === 61 || code === 63 || code == 65) {
    return { desc: "Rain", icon: "🌧️" };
  } else if (code === 71 || code === 73 || code === 75) {
    return { desc: "Snow", icon: "❄️" };
  } else if (code === 80 || code === 81 || code === 82) {
    return { desc: "Rain showers", icon: "🌦️" };
  } else if (code === 95) {
    return { desc: "Thunderstorm", icon: "⛈️" };
  } else {
    return "";
  }
};
// Convert UV index code to description
const getUVIndex = (code) => {
  if (code === 1 || code === 2) {
    return "Low";
  } else if (code === 3 || code === 4 || code === 5) {
    return "Moderate";
  } else if (code === 6 || code === 7) {
    return "High";
  } else if (code === 8 || code === 9 || code === 10) {
    return "Very High";
  } else if (code >= 11) {
    return "Extreme";
  } else {
    return "";
  }
};

// Update the DOM with 5-day forecast
const displayForecast = (daily) => {
  const forecastDates = daily.time.slice(0, 5);
  const forecastWeatherCodes = daily.weather_code.slice(0, 5);
  const forecastHighestTemp = daily.temperature_2m_max.slice(0, 5);
  const forecastLowestTemp = daily.temperature_2m_min.slice(0, 5);

  const getForecastDays = convertDateToDay(forecastDates);
  const getForecastWeatherIcons = convertWeatherCode(forecastWeatherCodes);

  let displayForecast = "";

  for (let i = 0; i < 5; i++) {
    displayForecast += `
        <div class="forecast-item">
            <p class="forecast-date">${getForecastDays[i]}</p>
            <div class="forecast-icon">${getForecastWeatherIcons[i].icon}</div>
            <div class="forecast-temperature">
                <p class="highest">${Math.round(forecastHighestTemp[i])}°</p>
                <p class="lowest">${Math.round(forecastLowestTemp[i])}°</p>
            </div>
        </div>
    `;
  }
  forecastTag.style.display = "block";
  forecastContainer.innerHTML = displayForecast;
};
// Converts dates to day
const convertDateToDay = (dates) => {
  const newDates = dates.map((date) => {
    const convertDate = new Date(date);
    const day = convertDate.getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day];
  });
  return newDates;
};
const convertWeatherCode = (codes) => {
  const weatherCodes = codes.map((code) => {
    return getWeatherDescription(code);
  });
  return weatherCodes;
};

// Main function triggered by the Search button
async function handleSearch(city) {
  const coordinateResponse = await getCoordinates(city);
  if (coordinateResponse.results) {
    const cityName = coordinateResponse.results[0].name;
    const countryName = coordinateResponse.results[0].country;
    const latitude = coordinateResponse.results[0].latitude;
    const longitude = coordinateResponse.results[0].longitude;
    displayLoadingSkeleton(cityName);
    const weatherResponse = await getWeather(latitude, longitude);
    if (weatherResponse) {
      displayCurrentWeather(weatherResponse, cityName, countryName);
      displayForecast(weatherResponse.daily);
      cityInput.value = "";
    }
  } else {
    errorMessage.style.display = "block";
  }
}

// Removes the error message (if any) when a user starts to type
cityInput.addEventListener("input", () => {
  errorMessage.style.display = "none";
});

// Handles the eventual click of the Search button
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let city = cityInput.value;
  if (!city) {
    return;
  }
  handleSearch(city.toLowerCase());
});

// on the first load of the screen
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(showPosition);
// }

// async function showPosition(position) {
//   const onLoadWeather = await getWeather(
//     position.coords.latitude,
//     position.coords.longitude,
//   );
// }
