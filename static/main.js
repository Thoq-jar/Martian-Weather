document.addEventListener('DOMContentLoaded', function () {
    function checkScreenSize() {
        if (window.innerWidth <= 359) {
            document.getElementById('weatherResult').innerHTML = '<p>Screen too small!</p>\n<p>Please reload on bigger window or screen!</p>';
        } else fetchWeather();
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