// JavaScript for Weather API Integration

document.getElementById('getWeather').addEventListener('click', function () {
    const city = document.getElementById('city').value; // Get the city name input
    const apiKey = 'a3c664237905e62dab482ad452c2c6a2'; // Replace with your OpenWeatherMap API key

    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    // Fetch the weather data from OpenWeatherMap API
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            // Construct the weather details
            const weather = `
                <p><strong>City:</strong> ${data.name}</p>
                <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
                <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            `;

            // Display the weather details in the result section
            document.getElementById('weatherResult').innerHTML = weather;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weatherResult').innerHTML = '<p>Unable to fetch weather data. Please try again.</p>';
        });
});
