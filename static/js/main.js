document.addEventListener('DOMContentLoaded', function () {
    function fetchWeather() {
        fetch('http://ip-api.com/json')
            .then(response => response.json())
            .then(data => {
                if (data.status !== 'success') {
                    document.getElementById('weatherResult').innerHTML = `<p>${data.message || 'Location not found.'}</p>`;
                } else {
                    const lat = data.lat;
                    const lon = data.lon;
                    const city = data.city;
                    document.getElementById('city-name').innerText = `${city}`;

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
                                    weatherData.main.speed < 5 ? 'low' : (weatherData.main.speed < 10 ? 'mid' : 'high'));
                                windSpeedGauge.innerText = `${weatherData.wind.speed.toFixed(1)} mph`;

                                weatherDescription.innerText = weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1);

                                weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
                                weatherIcon.style.display = 'inline';

                            }
                        })
                        .catch(error => {
                            document.getElementById('weatherResult').innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
                        });
                }
            })
            .catch(error => {
                document.getElementById('weatherResult').innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    fetchWeather();
});