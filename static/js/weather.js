function fetchWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        )
          .then((response) => response.json())
          .then((geoData) => {
            document.getElementById("city-name").innerText =
              geoData.address.city ||
              geoData.address.town ||
              geoData.address.village ||
              geoData.address.hamlet ||
              "Unknown location";

            fetch(`/fetch/weather?lat=${lat}&lon=${lon}`)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
              })
              .then((weatherData) => {
                if (weatherData.error) {
                  document.getElementById("weatherResult").innerHTML =
                    `<p>${weatherData.error}</p>`;
                } else {
                  updateWeatherDisplay(weatherData);
                  createRadarChart(
                    weatherData.main.temp,
                    weatherData.main.humidity,
                    weatherData.wind.speed,
                  );
                  fetchForecast(lat, lon).then();
                }
              })
              .catch((error) => {
                document.getElementById("weatherResult").innerHTML =
                  `<p>Error fetching weather data: ${error.message}</p>`;
              });
          })
          .catch((error) => {
            document.getElementById("weatherResult").innerHTML =
              `<p>Error fetching location data: ${error.message}</p>`;
          });
      },
      (error) => {
        document.getElementById("weatherResult").innerHTML =
          `<p>Error getting location: ${error.message}</p>`;
      },
    );
  } else {
    document.getElementById("weatherResult").innerHTML =
      "<p>Geolocation is not supported by this browser.</p>";
  }
}