//API call: http://api.openweathermap.org/data/2.5/forecast?q=toronto&appid=0958bd1155a3f8fcc1d1b82c92089c33 
// URL: 'https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

var apiKey = "0958bd1155a3f8fcc1d1b82c92089c33";
var searchBtn = $(".searchBtn");
var searchInput = $(".searchInput");

var searchCity = "";
var weatherContent;

//fetch function
function getTopWeather() {
    var apiURL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + searchCity + '&appid=0958bd1155a3f8fcc1d1b82c92089c33';
    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        console.log(data.city.name)
        console.log(data.list[0]) 
        });
};
getTopWeather();

//current data including city,date,icon,history
var cityNameEl = $(".cityName");
var currentDateEl = $(".currentDate");
var weatherIconEl = $(".weatherIcon");
var searchHistoryEl = $(".historyItems");

// card row column: representation of weather condition
var tempEl = $(".temp");
var humidityEl = $(".humidity");
var windSpeedEl = $(".windSpeed");
var uvIndexEl = $(".uvIndex");
var cardRow = $(".card-row");

// Create a current date variable
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var today = mm + '/' + dd + '/' + yyyy;

if (JSON.parse(localStorage.getItem("searchHistory")) === null) {
    console.log("searchHistory not found")
} else {
    console.log("searchHistory loaded into searchHistoryArr");
    renderSearchHistory();
}

//empty search field
searchBtn.on("click", function (e) {
    e.preventDefault();
    if (searchInput.val() === "") {
        alert("You need enter a city");
        return;
    }
    console.log("clicked button")
    getWeather(searchInput.val());
});

//history entry items
$(document).on("click", ".historyEntry", function () {
    console.log("the clicked history item")
    var thisElement = $(this);
    getWeather(thisElement.text());
})

//render search history (added newListItem for unchange history text li elment)
function renderSearchHistory(cityName) {
    searchHistoryEl.empty();
    var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
    for (var i = 0; i < searchHistoryArr.length; i++) {
        var newListItem = $("<li>").attr("class", "historyEntry");
        newListItem.text(searchHistoryArr[i]);
        searchHistoryEl.prepend(newListItem);
    }
}

// card row column: information of city,date,icon,temperature, humidity, wind Speed
function renderWeatherData(cityName, cityTemp, cityHumidity, cityWindSpeed, cityWeatherIcon, uvVal) {
    cityNameEl.text(cityName)
    currentDateEl.text(`(${today})`)
    tempEl.text(`Temperature: ${cityTemp} °C`);
    humidityEl.text(`Humidity: ${cityHumidity}%`);
    windSpeedEl.text(`Wind Speed: ${cityWindSpeed} km/h`);
    uvIndexEl.text(`UV Index: ${uvVal}`);
    weatherIconEl.attr("src", cityWeatherIcon);
}

function getWeather(desiredCity) {
    var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${desiredCity}&appid=${apiKey}&units=metric`;
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
        .then(function (weatherData) {
            var cityObj = {
                cityName: weatherData.name,
                cityTemp: weatherData.main.temp,
                cityHumidity: weatherData.main.humidity,
                cityWindSpeed: weatherData.wind.speed,
                cityUVIndex: weatherData.coord,
                cityWeatherIconName: weatherData.weather[0].icon
            }
            var queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityObj.cityUVIndex.lat}&lon=${cityObj.cityUVIndex.lon}&appid=${apiKey}&units=metric`
            $.ajax({
                url: queryUrl,
                method: 'GET'
            })
                .then(function (uvData) {
                    if (JSON.parse(localStorage.getItem("searchHistory")) == null) {
                        var searchHistoryArr = [];
                        // Keeps user from adding the same city to the searchHistory array list more than once
                        if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                            searchHistoryArr.push(cityObj.cityName);
                            // store our array of searches and save 
                            localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                            var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                            renderSearchHistory(cityObj.cityName);
                        } else {
                            console.log("City already in searchHistory. Not adding to history list")
                            var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                        }
                    } else {
                        var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
                        // Keeps user from adding the same city to the searchHistory array list more than once
                        if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                            searchHistoryArr.push(cityObj.cityName);
                            // store our array of searches and save 
                            localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                            var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                            renderSearchHistory(cityObj.cityName);
                        } else {
                            console.log("City already in searchHistory. Not adding to history list")
                            var renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                            renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                        }
                    }
                })

        });
    getFiveDayForecast();

    function getFiveDayForecast() {
        cardRow.empty();
        var queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${desiredCity}&appid=${apiKey}&units=metric`;
        $.ajax({
            url: queryUrl,
            method: "GET"
        })
            .then(function (fiveDayReponse) {
                for (var i = 0; i != fiveDayReponse.list.length; i += 8) {
                    var cityObj = {
                        date: fiveDayReponse.list[i].dt_txt,
                        icon: fiveDayReponse.list[i].weather[0].icon,
                        temp: fiveDayReponse.list[i].main.temp,
                        humidity: fiveDayReponse.list[i].main.humidity
                    }
                    var dateStr = cityObj.date;
                    var trimmedDate = dateStr.substring(0, 10);
                    var weatherIco = `https:///openweathermap.org/img/w/${cityObj.icon}.png`;
                    createForecastCard(trimmedDate, weatherIco, cityObj.temp, cityObj.humidity);
                }
            })
    }
}

function createForecastCard(date, icon, temp, humidity) {

    // HTML elements 
    var fiveDayCardEl = $("<div>").attr("class", "five-day-card");
    var cardDate = $("<h3>").attr("class", "card-text");
    var cardIcon = $("<img>").attr("class", "weatherIcon");
    var cardTemp = $("<p>").attr("class", "card-text");
    var cardHumidity = $("<p>").attr("class", "card-text");

    cardRow.append(fiveDayCardEl);
    cardDate.text(date);
    cardIcon.attr("src", icon);
    cardTemp.text(`Temp: ${temp} °C`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);
}

