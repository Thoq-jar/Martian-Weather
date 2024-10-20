document.addEventListener('DOMContentLoaded', function () {
    function checkScreenSize() {
        if (window.innerWidth <= 359) {
            document.getElementById('weatherResult').innerHTML = '<p>Screen too small!</p>\n<p>Please reload on bigger window or screen!</p>';
        } else {
            fetchWeather();
        }
    }

    async function fetchForecast(lat, lon) {
        const response = await fetch(`/fetch/forecast?lat=${lat}&lon=${lon}`);
        const data = await response.json();
    
        if (data.error) {
            console.error(data.error);
            return;
        }
    
        const forecastResult = document.getElementById('forecastResult');
        forecastResult.innerHTML = '';
    
        const days = data.daily.time;
        const maxTemps = data.daily.temperature_2m_max;
        const minTemps = data.daily.temperature_2m_min;
        const weatherCodes = data.daily.weathercode;
    
        days.forEach((date, index) => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            const weatherCode = weatherCodes[index];
            const weatherDescription = getWeatherDescription(weatherCode);
    
            const maxTempF = (maxTemps[index] * 9/5) + 32;
            const minTempF = (minTemps[index] * 9/5) + 32;
    
            forecastItem.innerHTML = `
                <h3>${new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                <p>Condition: ${weatherDescription}</p>
                <p>High: ${maxTempF.toFixed(1)} °F</p>
                <p>Low: ${minTempF.toFixed(1)} °F</p>
            `;
            forecastResult.appendChild(forecastItem);
        });
    }
    
    function getWeatherDescription(code) {
        const weatherCodes = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Drizzle: Light",
            53: "Drizzle: Moderate",
            55: "Drizzle: Dense",
            61: "Rain: Slight",
            63: "Rain: Moderate",
            65: "Rain: Heavy",
            71: "Snow fall: Slight",
            73: "Snow fall: Moderate",
            75: "Snow fall: Heavy",
            80: "Rain showers: Slight",
            81: "Rain showers: Moderate",
            82: "Rain showers: Heavy",
            95: "Thunderstorm: Slight",
            96: "Thunderstorm: Moderate",
            99: "Thunderstorm: Severe"
        };
        return weatherCodes[code] || "Unknown condition";
    }

    function fetchWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
                    .then(response => response.json())
                    .then(geoData => {
                        const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.hamlet || 'Unknown location';
                        document.getElementById('city-name').innerText = city;

                        fetch(`/fetch/weather?lat=${lat}&lon=${lon}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(weatherData => {
                                if (weatherData.error) {
                                    document.getElementById('weatherResult').innerHTML = `<p>${weatherData.error}</p>`;
                                } else {
                                    const tempGauge = document.getElementById('temperature-gauge');
                                    const humidityGauge = document.getElementById('humidity-gauge');
                                    const weatherDescription = document.getElementById('weather-description');
                                    const weatherIcon = document.getElementById('weather-icon');
                                    const windSpeedGauge = document.getElementById('wind-speed-guage');

                                    tempGauge.setAttribute('data-temp', '');
                                    humidityGauge.setAttribute('data-temp', '');

                                    tempGauge.setAttribute('data-temp',
                                        weatherData.main.temp < 60 ? 'low' : (weatherData.main.temp < 80 ? 'mid' : 'high'));
                                    tempGauge.innerText = `${weatherData.main.temp.toFixed(1)} °F`;

                                    humidityGauge.setAttribute('data-temp',
                                        weatherData.main.humidity < 60 ? 'low' : (weatherData.main.humidity < 80 ? 'mid' : 'high'));
                                    humidityGauge.innerText = `${weatherData.main.humidity.toFixed(1)} %`;

                                    windSpeedGauge.setAttribute('data-temp',
                                        weatherData.wind.speed < 5.1 ? 'low' : (weatherData.wind.speed < 10.1 ? 'mid' : 'high'));
                                    windSpeedGauge.innerText = `${weatherData.wind.speed.toFixed(1)} mph`;

                                    weatherDescription.innerText = weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1);

                                    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
                                    weatherIcon.style.display = 'inline';

                                    fetchForecast(lat, lon);
                                }
                            })
                            .catch(error => {
                                document.getElementById('weatherResult').innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
                            });
                    })
                    .catch(error => {
                        document.getElementById('weatherResult').innerHTML = `<p>Error fetching location data: ${error.message}</p>`;
                    });
            }, error => {
                document.getElementById('weatherResult').innerHTML = `<p>Error getting location: ${error.message}</p>`;
            });
        } else {
            document.getElementById('weatherResult').innerHTML = '<p>Geolocation is not supported by this browser.</p>';
        }
    }

    checkScreenSize();
});