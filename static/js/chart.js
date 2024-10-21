export function createRadarChart(temperature, humidity, windSpeed) {
    const ctx = document.getElementById('weatherData').getContext('2d');
    const data = {
        labels: ['Temperature (°F)', 'Humidity (%)', 'Wind Speed (mph)'],
        datasets: [{
            label: 'Current Weather',
            data: [temperature, humidity, windSpeed],
            backgroundColor: 'rgba(255,99,99,0.2)',
            borderColor: 'rgb(255,117,99)',
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            r: {
                beginAtZero: true,
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'radar',
        data: data,
        options: options
    });
}