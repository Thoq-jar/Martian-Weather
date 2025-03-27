document.addEventListener("DOMContentLoaded", function () {
  function checkScreenSize() {
    if (window.innerWidth <= 359) {
      document.getElementById("weatherResult").innerHTML =
        "<p>Screen too small!</p><br/><p>Please reload on bigger window or screen!</p>";
      return false;
    }
    return true;
  }

  function getLocation() {
    if (!navigator.geolocation) {
      document.getElementById("weatherResult").innerHTML =
        "<p>Geolocation is not supported by this browser.</p>";
      return;
    }

    if (!checkScreenSize()) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        loadWeatherData(lat, lon);
      },
      function(error) {
        document.getElementById("weatherResult").innerHTML =
          `<p>Error getting location: ${error.message}</p>`;
      }
    );
  }

  function loadWeatherData(lat, lon) {
    const weatherUrl = `/weather?lat=${lat}&lon=${lon}`;
    const forecastUrl = `/forecast?lat=${lat}&lon=${lon}`;
    const chartUrl = `/chart?lat=${lat}&lon=${lon}`;
    
    htmx.ajax('GET', weatherUrl, '#weatherResult');
    
    htmx.ajax('GET', forecastUrl, '#forecastResult');
    
    htmx.ajax('GET', chartUrl, '#weatherData');
  }

  getLocation();
  
  window.addEventListener('resize', checkScreenSize);
});