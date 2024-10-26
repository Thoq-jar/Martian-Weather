async function fetchWeather() {
  if (!navigator.geolocation) {
    document.getElementById("weatherResult").innerHTML =
      "<p>Geolocation is not supported by this browser.</p>";
    return;
  }

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const geoData = await geoResponse.json();

    document.getElementById("city-name").innerText =
      geoData.address.city ||
      geoData.address.town ||
      geoData.address.village ||
      geoData.address.hamlet ||
      "Unknown location";

    const weatherResponse = await fetch(`/fetch/weather?lat=${lat}&lon=${lon}`);
    if (!weatherResponse.ok) {
      throw new Error(`HTTP error! status: ${weatherResponse.status}`);
    }
    const weatherData = await weatherResponse.json();

    if (weatherData.error) {
      document.getElementById("weatherResult").innerHTML =
        `<p>${weatherData.error}</p>`;
    } else {
      updateWeatherDisplay(weatherData);
      createRadarChart(
        weatherData.main.temp,
        weatherData.main.humidity,
        weatherData.wind.speed
      );
      await fetchForecast(lat, lon);
    }
  } catch (error) {
    document.getElementById("weatherResult").innerHTML =
      `<p>Error: ${error.message}</p>`;
  }
}