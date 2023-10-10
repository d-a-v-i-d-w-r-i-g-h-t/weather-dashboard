var searchFormEl = document.getElementById("search-form");
var locationInputEl = document.getElementById("location");
var searchHistoryContainerEl = document.getElementById("search-history-container");

const APIKEY = "8a460ddb56358cc62f71346e740a0abf";
var latitude = 0;
var longitude = 0;

var currentWeather = {
  date: "",
  city: "",
  icon: "",
  temperature: 0,
  humidity: 0,
  windSpeed: 0,
  windDirection: 0
}

var fiveDayWeather = {
  city: "",
  0: {
    date: "",
    icon: "",
    tempHi: 0,
    tempLo: 0,
    humidity: 0,
    windSpeed: 0,
    windDirection: 0
  },
  1: {
    date: "",
    icon: "",
    tempHi: 0,
    tempLo: 0,
    humidity: 0,
    windSpeed: 0,
    windDirection: 0
  },
  2: {
    date: "",
    icon: "",
    tempHi: 0,
    tempLo: 0,
    humidity: 0,
    windSpeed: 0,
    windDirection: 0
  },
  3: {
    date: "",
    icon: "",
    tempHi: 0,
    tempLo: 0,
    humidity: 0,
    windSpeed: 0,
    windDirection: 0
  },
  4: {
    date: "",
    icon: "",
    tempHi: 0,
    tempLo: 0,
    humidity: 0,
    windSpeed: 0,
    windDirection: 0
  }              
}




var performLocationSearch = function(location) {
  // https://openweathermap.org/api/geocoding-api
  // http://api.openweathermap.org/geo/1.0/direct?q=
  // {city name},{state code},{country code}&limit={limit}&appid={API key}

  var geocodeApiURL = "http://api.openweathermap.org/geo/1.0/direct?q=" +
                        location + "&appid=" + APIKEY;
  console.log("API URL: " + geocodeApiURL);

  fetch(geocodeApiURL)
    .then(function(response) {
      if(response.ok) {
        // console.log("Response:");
        // console.log(response);
        response.json()
          .then(function(data){
            // console.log("Data:");
            // console.log(data);
            // console.log(typeof(data));

            latitude = data[0].lat;
            longitude = data[0].lon;
            // console.log("Latitude: " + latitude);
            // console.log("Longitude: " + longitude);

            performCurrentWeatherSearch(latitude, longitude);
            // perform5DayWeatherSearch(latitude, longitude);
          });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to OpenWeather");
    });
};


var performCurrentWeatherSearch = function(lat, lon) {
  // https://openweathermap.org/current
  // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

  var currentWeatherApiURL = "https://api.openweathermap.org/data/2.5/weather?lat=" +
                              lat + "&lon=" + lon + "&appid=" + APIKEY + "&units=imperial";
  console.log("API URL: " + currentWeatherApiURL);

  fetch(currentWeatherApiURL)
    .then(function(response) {
      if(response.ok) {
        console.log("Response:");
        console.log(response);
        response.json()
          .then(function(data){
            console.log("Data:");
            console.log(data);
            console.log(typeof(data));

            currentWeather.city = data.name;
            currentWeather.date = dayjs().format("MMMM D, YYYY");
            currentWeather.icon = data.weather[0].icon;
            currentWeather.temperature = Math.round(data.main.temp);
            currentWeather.humidity = data.main.humidity;
            currentWeather.windSpeed = Math.round(data.wind.speed);
            currentWeather.windDirection = data.wind.deg;

            console.log(currentWeather);

            saveSearchHistory(currentWeather.city);
          });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to OpenWeather");
    });
};


searchFormEl.addEventListener("submit", function (event) {
  event.preventDefault();

  var searchLocation = locationInputEl.value.trim();
  console.log("Search location: " + searchLocation);

  if (searchLocation) {
    performLocationSearch(searchLocation);
    locationInputEl.value = "";
  }
});


function runWeatherDashboard() {
  loadSearchHistory();
}

  //---------------------------------------------------------//
  //  Functions: load, save, and buildSearchHistory  //
//---------------------------------------------------------//

function loadSearchHistory() {
  searchHistory = JSON.parse(localStorage.getItem("searchHistoryStringify"));

  // if search history isn't saved in local storage, initialize the array variable
  if (!searchHistory) {
    searchHistory = [];
  }
  buildSearchHistory();
}

function saveSearchHistory(location) {
  isUnique = true;
  for (var i = 0; i < searchHistory.length; i++) {
    if (location === searchHistory[i]) {
      isUnique = false;
    }
  }
  if (isUnique === true) {
    searchHistory.push(location);
    localStorage.setItem("searchHistoryStringify", JSON.stringify(searchHistory));
    buildSearchHistory();
  }
}

function buildSearchHistory() {
  
  // empty the region
  //$("searchHistoryEl").empty();

  for (var i = 0; i < searchHistory.length; i++) {
    addSearchHistoryButton(i);
  }
}

function addSearchHistoryButton(i) {
  var newDiv = "<div>";
  newDiv
}

// <button type="button" class="btn btn-primary">Primary</button>
