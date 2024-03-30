document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const historyList = document.getElementById('history');
    const todaySection = document.getElementById('today');
    const forecastSection = document.getElementById('forecast');
    const apiKey = '8f4360034de33b795d22db2e7a896dc9'; 

    // Event listener for form submission
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const cityName = searchInput.value.trim();
        if(cityName !== '') {
            getWeather(cityName);
            searchInput.value = ''; // Clear input field after submission
        }
    });

    // Event listener for clicking on search history
    historyList.addEventListener('click', function(event) {
        if(event.target.tagName === 'BUTTON') {
            const cityName = event.target.dataset.city;
            getWeather(cityName);
        }
    });

    // Function to fetch weather data
    function getWeather(cityName) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                updateWeatherUI(data);
                saveToLocalStorage(cityName);
            })
            .catch(error => {
                console.error('Error fetching weather:', error.message);
                // Display error message to user
                // Clear UI
            });
    }

    // Function to update UI with weather data
    function updateWeatherUI(data) {
        const cityName = data.name;
        const date = new Date(data.dt * 1000).toLocaleDateString();
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        const todayHTML = `
            <h2>${cityName} - ${date}</h2>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>Temperature: ${temperature}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;
        todaySection.innerHTML = todayHTML;
    }

    // Function to save searched city to localStorage
    function saveToLocalStorage(cityName) {
        let searchHistory = localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];
        if (!searchHistory.includes(cityName)) {
            searchHistory.push(cityName);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            renderSearchHistory();
        }
    }

    // Function to retrieve search history from localStorage
    function getSearchHistory() {
        return localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];
    }

    // Function to render search history
    function renderSearchHistory() {
        const searchHistory = getSearchHistory();
        historyList.innerHTML = '';
        searchHistory.forEach(city => {
            const button = document.createElement('button');
            button.textContent = city;
            button.dataset.city = city;
            button.classList.add('list-group-item', 'list-group-item-action');
            historyList.appendChild(button);
        });
    }

    // Initialize the application
    function init() {
        renderSearchHistory();
    }

    // Call init to initialize the application
    init();
});
