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
};
console.log("api is called", getCityWeather);


// function to handle search button
var searchSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element
    var cityName = $("#city-name").val().trim();

    // check if the search field has a value
    if(cityName) {
        // pass the value to getCityWeather function
        getCityWeather(cityName);

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

       // 5 day api call
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial")
    .then(function(response) {
        response.json().then(function(data) {

            // clear any previous entries in the 5-day forecast
            $("#five-day").empty();

            // get every 8th value (24hours) in the returned array from the api call
            for(i = 7; i <= data.list.length; i += 8){

                // insert data into my card forecast
                var fiveDayCard =`
                <div class="col-md-2 m-2 py-3 card text-white bg-primary">
                    <div class="card-body p-1">
                        <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                        <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                        <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>
                        <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                    </div>
                </div>
                `;

                // append the day to the 5-day forecast
                $("#five-day").append(fiveDayCard);
           }
        })
    });
    console.log("5 day api call", fetch)
    };




    // event handlers
$("#search-form").submit(searchSubmitHandler);
$("#search-history").on("click", function(event){

    getCityWeather();
});
