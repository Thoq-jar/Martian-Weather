function updateWeatherDisplay(weatherData) {
  const tempGauge = document.getElementById("temperature-gauge");
  const humidityGauge = document.getElementById("humidity-gauge");
  const weatherDescription = document.getElementById("weather-description");
  const weatherIcon = document.getElementById("weather-icon");
  const windSpeedGauge = document.getElementById("wind-speed-guage");

  tempGauge.setAttribute("data-temp", "");
  humidityGauge.setAttribute("data-temp", "");

  tempGauge.setAttribute(
    "data-temp",
    weatherData.main.temp < 60
      ? "low"
      : weatherData.main.temp < 100
        ? "mid"
        : "high",
  );
  tempGauge.innerText = `${weatherData.main.temp.toFixed(1)} °F`;

  humidityGauge.setAttribute(
    "data-temp",
    weatherData.main.humidity < 60
      ? "low"
      : weatherData.main.humidity < 80
        ? "mid"
        : "high",
  );
  humidityGauge.innerText = `${weatherData.main.humidity.toFixed(1)} %`;

  windSpeedGauge.setAttribute(
    "data-temp",
    weatherData.wind.speed < 5.1
      ? "low"
      : weatherData.wind.speed < 100.1
        ? "mid"
        : "high",
  );
  windSpeedGauge.innerText = `${weatherData.wind.speed.toFixed(1)} mph`;

  weatherDescription.innerText =
    weatherData.weather[0].description.charAt(0).toUpperCase() +
    weatherData.weather[0].description.slice(1);

  weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  weatherIcon.style.display = "inline";
}

function createRadarChart(temperature, humidity, windSpeed) {
  const ctx = document.getElementById("weatherData").getContext("2d");
  const data = {
    labels: ["Temperature (°F)", "Humidity (%)", "Wind Speed (mph)"],
    datasets: [
      {
        label: "Current Weather",
        data: [temperature, humidity, windSpeed],
        backgroundColor: "rgba(255,99,99,0.2)",
        borderColor: "rgb(255,117,99)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  };

  new Chart(ctx, {
    type: "radar",
    data: data,
    options: options,
  });
}