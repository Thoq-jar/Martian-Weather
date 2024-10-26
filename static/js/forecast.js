async function fetchForecast(lat, lon) {
  const response = await fetch(`/fetch/forecast?lat=${lat}&lon=${lon}`);
  const data = await response.json();

  if (data.error) {
    console.error(data.error);
    return;
  }

  const forecastResult = document.getElementById("forecastResult");
  forecastResult.innerHTML = "";

  const days = data.daily.time;
  const maxTemps = data.daily.temperature_2m_max;
  const minTemps = data.daily.temperature_2m_min;
  const weatherCodes = data.daily.weathercode;

  days.forEach((date, index) => {
    const forecastItem = document.createElement("div");
    forecastItem.className = "forecast-item";
    const weatherCode = weatherCodes[index];
    const weatherDescription = getWeatherDescription(weatherCode);

    const maxTempF = (maxTemps[index] * 9) / 5 + 32;
    const minTempF = (minTemps[index] * 9) / 5 + 32;

    forecastItem.innerHTML = `
            <h3>${new Date(date).toLocaleDateString("en-US", { weekday: "long" })}</h3>
            <p>${weatherDescription}</p>
            <p>High: ${maxTempF.toFixed(1)} °F</p>
            <p>Low: ${minTempF.toFixed(1)} °F</p>
        `;
    forecastResult.appendChild(forecastItem);
  });
}