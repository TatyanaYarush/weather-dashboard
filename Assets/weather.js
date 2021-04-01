//API call: http://api.openweathermap.org/data/2.5/forecast?q=toronto&appid=0958bd1155a3f8fcc1d1b82c92089c33 
// URL: 'https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

var apiKey = "0958bd1155a3f8fcc1d1b82c92089c33";
var searchBtn = $(".searchBtn");
var searchInput = $(".searchInput");

var searchCity = "ottawa";
var weatherContent;

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

