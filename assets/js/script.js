
// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {


  var searchFormEl = $("#search-form");
  var locationInputEl = $("#location");
  var searchHistoryContainerEl = $("search-history-container");


  searchFormEl.addEventListener('submit', searchFormSubmit);


  runWeatherDashboard() {

    loadSearchHistory();


  }


  var searchFormSubmit = function (event) {
    event.preventDefault();

    var location = locationInputEl.value.trim();

    if (location) {
      performLocationSearch(location);
      locationInputEl.value = "";
    }
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