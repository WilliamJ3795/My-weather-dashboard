// array to hold the users search history
var searchHistory = []
var lastCitySearched = ""

// api call to openweathermap.org
var getCityWeather = function(city) {
    // declare the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial";
     // request call to api
     fetch(apiUrl)
     .then(function(response) {
     // request was successful
         if (response.ok) {
             response.json().then(function(data) {
                 displayWeather(data);
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
};
