document.addEventListener("DOMContentLoaded", function () {
  function checkScreenSize() {
    if (window.innerWidth <= 359) {
      document.getElementById("weatherResult").innerHTML =
        "<p>Screen too small!</p>\n<p>Please reload on bigger window or screen!</p>";
      return;
    }

    fetchWeather();
  }

  checkScreenSize();
});