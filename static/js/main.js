document.addEventListener('DOMContentLoaded', function() {
    function fetchWeather() {
        fetch('/geolocation')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById('weatherResult').innerHTML = `<p>${data.error}</p>`;
                } else {
                    const lat = data.lat;
                    const lon = data.lon;
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
                                const windSpeedElement = document.getElementById('wind-speed');

                                tempGauge.setAttribute('data-temp', '');
                                humidityGauge.setAttribute('data-temp', '');

                                tempGauge.setAttribute('data-temp', 
                                    weatherData.main.temp < 60 ? 'low' : (weatherData.main.temp < 80 ? 'mid' : 'high'));
                                tempGauge.innerText = `${weatherData.main.temp.toFixed(1)} °F`;

                                humidityGauge.setAttribute('data-temp', 
                                    weatherData.main.humidity < 60 ? 'low' : (weatherData.main.humidity < 80 ? 'mid' : 'high'));
                                humidityGauge.innerText = `${weatherData.main.humidity.toFixed(1)} %`;

                                weatherDescription.innerText = weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1);
                                
                                weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
                                weatherIcon.style.display = 'inline';

                                windSpeedElement.innerText = `${weatherData.wind.speed.toFixed(1)} mph`;
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