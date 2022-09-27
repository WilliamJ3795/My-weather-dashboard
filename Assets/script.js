// array to hold the users search history
var searchHistory = []
var lastCitySearched = ""

var collectCityData = function(city) {
    
    // declare the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial"
     // request call to api
     fetch(apiUrl)
     .then(function(response) {
     // request was successful
         if (response.ok) {
             response.json().then(function(data) {
                 showWeather(data);
             });
         // request fails
         } else {
             alert("Oh no: " + response.statusText);
         }
     })  

     // alert user if there is no response from OpenWeather
     .catch(function(error) {
         alert("Unable to connect to OpenWeather");
     })
     console.log("api is called", collectCityData);
};



// function to handle search button
var searchSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element
    var cityName = $("#city-name").val().trim();

    // check if the search field has a value
    if(cityName) {
        // pass the value to getCityWeather function
        collectCityData(cityName);

        // clear the search input
        $("#city-name").val("");
    }
};
console.log("value is passed", searchSubmitHandler);

// function to show the information collected from openweathermap.org
var showWeather = function(weatherData) {

    // format and display the values
    $("#main-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
    $("#main-city-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + "°F");
    $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + "%");
    $("#main-city-wind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");

       // use lat & lon to make the uv api call
       fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon="+ weatherData.coord.lon + "&appid=ce39e7239416ad754359ca762d28521a")
       .then(function(response) {
           response.json().then(function(data) {

               // display the uv index value
               $("#uv-box").text(data.value);

               // highlight the value using the EPA's UV Index Scale colors
               if(data.value >= 11) {
                   $("#uv-box").css("background-color", "#6c49cb")
               } else if (data.value < 11 && data.value >= 8) {
                   $("#uv-box").css("background-color", "#d90011")
               } else if (data.value < 8 && data.value >= 6) {
                   $("#uv-box").css("background-color", "#f95901")
               } else if (data.value < 6 && data.value >= 3) {
                   $("#uv-box").css("background-color", "#f7e401")
               } else {
                   $("#uv-box").css("background-color", "#299501")
               }      
           })
       });
       console.log("this function works", showWeather)


   // save the last city searched
   lastCitySearched = weatherData.name;

   // save to the search history using the api's name value
   // this also keeps searches that did not return a result from populating the array
   saveSearchHistory(weatherData.name);

   
};
// function to save the city search history to local storage
var saveSearchHistory = function (city) {
    if(!searchHistory.includes(city)){
        searchHistory.push(city);
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")
    } 

    // save the searchHistory array to local storage
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));

    // save the lastCitySearched to local storage
    localStorage.setItem("lastCitySearched", JSON.stringify(lastCitySearched));

    // display the searchHistory array
    loadSearchHistory();
};
// function to load saved city search history from local storage
var loadSearchHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    lastCitySearched = JSON.parse(localStorage.getItem("lastCitySearched"));

    // clear any previous values from th search-history ul
    $("#search-history").empty();

    // for loop that will run through all the citys found in the array
     for(i = 0 ; i < searchHistory.length ;i++) 
    {

        // add the city as a link, set it's id, and append it to the search-history ul
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + searchHistory[i] + "'>" + searchHistory[i] + "</a>");
    }
  };




 // event handlers
$("#search-form").submit(searchSubmitHandler);
$("#search-history").on("click", function(event){
    // get the links id value
    let prevCity = $(event.target).closest("a").attr("id");
    // pass it's id value to the getCityWeather function
   collectCityData(prevCity);
});
