const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getCoordinates(city);
});

const getCoordinates = async city => {
  document.getElementById("error").textContent = "";

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      showError("City not found!");
      return;
    }

    const { latitude, longitude, name, country } = data.results[0];
    getWeather(latitude, longitude, name, country);
  } catch (error) {
    showError("Unable to fetch weather.");
  }
};

const getWeather = async (lat, lon, city, country) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const weather = data.current_weather;

    updateUI({
      city: `${city}, ${country}`,
      temp: weather.temperature,
      wind: weather.windspeed,
      code: weather.weathercode
    });
  } catch (error) {
    showError("Failed to load weather.");
  }
};

const getIcon = code => {
  if (code === 0) return "https://img.icons8.com/fluency/96/sun.png";
  if ([1, 2, 3].includes(code))
    return "https://img.icons8.com/fluency/96/partly-cloudy-day.png";
  if ([45, 48].includes(code))
    return "https://img.icons8.com/fluency/96/foggy-night.png";
  if ([51, 53, 55, 56, 57].includes(code))
    return "https://img.icons8.com/fluency/96/light-rain.png";
  if ([61, 63, 65].includes(code))
    return "https://img.icons8.com/fluency/96/rain.png";
  if ([71, 73, 75].includes(code))
    return "https://img.icons8.com/fluency/96/snow.png";
  if ([80, 81, 82].includes(code))
    return "https://img.icons8.com/fluency/96/rain-cloud.png";
  if ([95, 96, 99].includes(code))
    return "https://img.icons8.com/fluency/96/storm.png";

  return "https://img.icons8.com/fluency/96/cloud.png";
};

const updateUI = data => {
  document.getElementById("weatherCard").classList.remove("hidden");
  document.getElementById("cityName").textContent = data.city;
  document.getElementById("temperature").textContent = `${data.temp}°C`;
  document.getElementById("wind").textContent = data.wind;
  document.getElementById("description").textContent = decodeWeatherCode(
    data.code
  );
  document.getElementById("weatherIcon").src = getIcon(data.code);
};

const decodeWeatherCode = code => {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Heavy rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm"
  };
  return map[code] || "Unknown";
};

const showError = msg => {
  document.getElementById("error").textContent = msg;
  document.getElementById("weatherCard").classList.add("hidden");
};
