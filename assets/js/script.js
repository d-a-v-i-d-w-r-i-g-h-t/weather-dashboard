var searchFormEl = document.getElementById("search-form");
var locationInputEl = document.getElementById("location");
var searchHistoryContainerEl = document.getElementById("search-history-container");

const APIKEY = "8a460ddb56358cc62f71346e740a0abf";

// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {


  var performLocationSearch = function(location) {
    // https://openweathermap.org/api/geocoding-api
    // http://api.openweathermap.org/geo/1.0/direct?q=
    // {city name},{state code},{country code}&limit={limit}&appid={API key}

    var geocodeApiURL = "http://api.openweathermap.org/geo/1.0/direct?q=" +
                         location + "&appid=" + APIKEY;
    console.log(geocodeApiURL);

    fetch(geocodeApiURL)
      .then(function(response) {
        if(response.ok) {
          console.log(response);
          response.json()
            .then(function(data){
              console.log(data);
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
    console.log(searchLocation);

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

  function saveSearchHistory() {
    localStorage.setItem("searchHistoryStringify", JSON.stringify(searchHistory));
    buildSearchHistory();
  }

  function buildSearchHistory() {
    
    // empty the region
    //$("searchHistoryEl").empty();

    for (var i = 0; i < searchHistory.length; i++) {
      addSearchHistoryButton(i);
    }
  }







});