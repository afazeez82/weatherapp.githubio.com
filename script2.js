//adding the moment library for dates
moment().format('L');

//creating a function that takes the city name

function searchAcity(cityname) {
    var APIKey = "3a96b70d088351e1d702dd93ad7f7f24";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=" + APIKey;
    var queryURLforcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        console.log(queryURL);
        $("#current").empty();

        var currentDate = moment().format('L');

        //creating city information and writting it to the DOM
        var cityNameEl = $("<h2>").text(response.name);
        var displayCurrentDate = cityNameEl.append(" " + currentDate);
        var tempEl = $("<p>").text("Temperature: " + response.main.temp);
        var humEl = $("<p>").text("Humidity: " + response.main.humidity);
        var windEl = $("<p>").text("Wind Speed: " + response.wind.speed);

        var currentWeather = response.weather[0].main;

        switch (currentWeather) {
            case "Rain":
                var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                currentIcon.attr("style", "height: 60px; width: 60px");
                break;
            case "Clouds":
                var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                currentIcon.attr("style", "height: 60px; width: 60px");
                break;
            case "Clear":
                var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                currentIcon.attr("style", "height: 60px; width: 60px");
                break;
            case "Drizzle":
                var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                currentIcon.attr("style", "height: 60px; width: 60px");
                break;
            case "Snow":
                var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                currentIcon.attr("style", "height: 60px; width: 60px");
                break;
        }
        var newDiv = $('<div>');
        newDiv.append(displayCurrentDate, currentIcon, tempEl, humEl, windEl);
        //newDiv.append(displayCurrentDate, tempEl, humEl, windEl);
        $("#current").html(newDiv);


        //-------UV Call--------------------------
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        var queryURLuv = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: queryURLuv,
            method: 'GET'
        }).then(function (response) {
            $("#uvl-display").empty();
            console.log(response)
            var uvlresults = response.value;
            //create 
            var uvButtonEl = $("<button class='btn bg-success'>").text("UV Index: " + uvlresults);
            $("#uvl-display").html(uvButtonEl);
        });

    });

    //-------------5 day forecast call-----------------
    //call api
    $.ajax({
        url: queryURLforcast,
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        var results = response.list;
        console.log(results.length);
        //empty five day div
        $("#5day").empty();

        //create loop for 5 day forecast
        for (var i = 0; i < results.length; i += 8) {

            //create a div
            var fiveDayDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.7rem; height: 11rem;'>");


            //storing the responses date temp and humidity

            var dateEl = results[i].dt_txt;
            var setDate = dateEl.substr(0, 10);
            var tempEl = results[i].main.temp;
            var humidityEl = results[i].main.humidity;

            //creating tags with the result items info

            var h5Date = $("<h5 class='card-title'>").text(setDate);
            var pTempEl = $("<p class='card-text'>").text("Temp: " + tempEl);
            var pHumidityEl = $("<p class='card-text'>").text("Humidity: " + humidityEl);


            //determine the weather icon to show
            var latestWeatherIcon = results[i].weather[0].main;

            switch (latestWeatherIcon) {
                case "Rain":
                    var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                    currentIcon.attr("style", "height: 60px; width: 60px");
                    break;
                case "Clouds":
                    var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                    currentIcon.attr("style", "height: 60px; width: 60px");
                    break;
                case "Clear":
                    var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                    currentIcon.attr("style", "height: 60px; width: 60px");
                    break;
                case "Drizzle":
                    var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                    currentIcon.attr("style", "height: 60px; width: 60px");
                    break;
                case "Snow":
                    var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                    currentIcon.attr("style", "height: 60px; width: 60px");
                    break;
            }

            //append items to fiveday div
            fiveDayDiv.append(h5Date, pTempEl, pHumidityEl, currentIcon);
            $("#5day").append(fiveDayDiv);


        }

    });

}
// end searchAcity Function here
pageLoad();

//----created the function to get the value that is inputted in the search text box and store it to local storage
// JS select city ID on click function
$("#select-city").on("click", function (event) {
    event.preventDefault();
    // store the cityname
    var cityInput = $("#city-input").val().trim();
    console.log(cityInput)
    // save in local storage
    var textContent = $(this).siblings("input").val();
    //create a empty array
    var storearr = [];
    //pushing values to empty array
    storearr.push(textContent);
    //save to local storage JSON.stringify(storearr)
    localStorage.setItem('cityName', JSON.stringify(storearr));
    //call searchAcity
    searchAcity(cityInput);
    pageLoad();

});

//-----creating the pageload function--------

function pageLoad() {
    var previousLastSearch = JSON.parse(localStorage.getItem("cityName"));
    var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(previousLastSearch);
    var pSearchTag = $("<div>");
    pSearchTag.append(searchDiv)
    $("#searchhistory").prepend(pSearchTag);

}


//Event delegation......

$("#searchhistory").on('click', '.btn', function (event) {
    event.preventDefault();
    searchAcity($(this).text());


});


















