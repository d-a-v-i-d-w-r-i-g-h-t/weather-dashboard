var searchFormEl = document.getElementById("search-form");
var locationInputEl = document.getElementById("location");
var searchHistoryContainerEl = document.getElementById("search-history-container");

const APIKEY = "8a460ddb56358cc62f71346e740a0abf";

var searchHistory = [];
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

var forecastWeather = {};




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
            performForecastWeatherSearch(latitude, longitude);
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

  var currentWeatherApiURL = "https://api.openweathermap.org/data/2.5/weather?" +
                             "lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY + "&units=imperial";
  console.log("API URL: " + currentWeatherApiURL);

  fetch(currentWeatherApiURL)
    .then(function(response) {
      if(response.ok) {
        // console.log("Response:");
        // console.log(response);
        response.json()
          .then(function(data){
            // console.log("Data:");
            // console.log(data);
            // console.log(typeof(data));

            currentWeather.city = data.name;
            currentWeather.date = dayjs().format("MMMM D, YYYY");
            currentWeather.icon = data.weather[0].icon;
            currentWeather.temperature = Math.round(data.main.temp);
            currentWeather.humidity = data.main.humidity;
            currentWeather.windSpeed = Math.round(data.wind.speed);
            currentWeather.windDirection = data.wind.deg;

            console.log("Current weather:");
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


var performForecastWeatherSearch = function(lat, lon) {
  // https://openweathermap.org/forecast5
  // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

  var forecastWeatherApiURL = "https://api.openweathermap.org/data/2.5/forecast?" +
                             "lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY + "&units=imperial";
  console.log("API URL: " + forecastWeatherApiURL);

  fetch(forecastWeatherApiURL)
    .then(function(response) {
      if(response.ok) {
        // console.log("Response:");
        // console.log(response);
        response.json()
          .then(function(data){
            console.log("Data:");
            console.log(data);
            console.log(typeof(data));
            
          
            forecastWeather.city = data.city.name;
            forecastWeather.timezone = data.city.timezone;

            for (var i = 0; i < data.cnt; i++) {
              // initialize forecastWeather[i]
              forecastWeather[i] = {};
              forecastWeather[i].date = dayjs(data.list[i].dt_txt).add(data.city.timezone, "second");
              console.log(dayjs(data.list[i].dt_txt).add(data.city.timezone, "second").format("MMMM D, YYYY h:mm a"));
         
              forecastWeather[i].icon = data.list[i].weather[0].icon;
              forecastWeather[i].temp = Math.round(data.list[i].main.temp);
              forecastWeather[i].humidity = data.list[i].main.humidity;
              forecastWeather[i].windSpeed = data.list[i].wind.speed;
              forecastWeather[i].windDirection = data.list[i].wind.deg;
            }

            console.log(forecastWeather);

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

  var searchLocation = locationInputEl.value.trim().replace(/ /g, "%20");
  console.log("Search location: " + searchLocation);

  if (searchLocation) {
    performLocationSearch(searchLocation);
    locationInputEl.value = "";
  }
});





  //-------------------------------------------------//
 //  Functions: load, save, and buildSearchHistory  //
//-------------------------------------------------//

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
  searchHistoryContainerEl.replaceChildren();

  for (var i = 0; i < searchHistory.length; i++) {
    addSearchHistoryButton(i);
  }
}

function addSearchHistoryButton(i) {
  var newDiv = document.createElement("div");
  newDiv.textContent = searchHistory[i];
  newDiv.setAttribute("data-buttonid", i);
  newDiv.classList.add("button");
  searchHistoryContainerEl.appendChild(newDiv);
}

searchHistoryContainerEl.addEventListener("click", function(event) {
  var element = event.target;
  // console.log(element);
  if (element.matches(".button")) {
    // console.log("match");
    var buttonID = element.getAttribute("data-buttonid");
    // console.log("Button clicked: " + buttonID);
    var searchLocation = searchHistory[buttonID];
    // console.log("location");
    performLocationSearch(searchLocation);
  }

});

loadSearchHistory();
