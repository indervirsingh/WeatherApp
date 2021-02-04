// API
    const api = {
        key: "772ead604a92fa421851e4497ee77015",
        base: "https://api.openweathermap.org/data/2.5/"
    }
// ------------------------------------------------------------------------------

// HARD CODED ELEMENTS

    var citySearched = document.querySelector(".search-text"); // element type: <input> use .value
    var cityAndDate = document.querySelector("#city"); // element type: <p> use .innerHTML
    var temp = document.querySelector("#temperature"); // element type: <p>
    var humidity = document.querySelector("#humidity"); // element type: <p>
    var windSpeed = document.querySelector("#wind-speed"); // element type: <p>
    var uvIndex = document.querySelector("#uv-index"); // element type: <span>

    var searchButton = document.getElementById("search-button"); // element type: <button>
// ------------------------------------------------------------------------------

// FUNCTIONS

    // Create function for when the search button is clicked
    const loadData = (event) => {

        let city = citySearched.value;
        // Now we get the data using API
        fetch(`${api.base}weather?q=${city}&units=imperial&appid=${api.key}`)
            .then(weather => {
                return weather.json();

            }).then(displayResults);

    };

    // Uses the city examples on screen
    // TODO:
    const loadSearches = (event) => {

    };

    const displayResults = (weather) => {
        // Date (MM/DD/YYYY)
        let date = moment().format("l");

        // Get current longitude, latitude, city, temp, humidity, wind speed
        let lon = `${weather.coord.lon}`;
        let lat = `${weather.coord.lat}`;
        let currentCity = `${weather.name}`;
        let currentTemp = `${(weather.main.temp).toFixed(2)}`;
        let currentHumidity = `${weather.main.humidity}`;
        let currentWindSpeed = `${(weather.wind.speed).toFixed(1)}`;


        // Get an icon
        var icon = `${weather.weather[0].icon}`;
        var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
        // create an image from it then add it to the page
        var iconImg = document.createElement("img");
        iconImg.src = iconUrl;

        // Change the HTML on screen
        cityAndDate.innerHTML = currentCity + " (" + date + ")";
        cityAndDate.append(iconImg);
        temp.innerHTML = "Temperature: " + currentTemp + " °F"
        humidity.innerHTML = "Humidity: " + currentHumidity + "%"
        windSpeed.innerHTML = "Wind Speed: " + currentWindSpeed + " MPH";

        // Fetch the uvi data
        fetch(`${api.base}uvi?lat=${lat}&lon=${lon}&appid=${api.key}`)
            .then(uvi => {
                return uvi.json();
            })
            .then(uvi => {
                // Display UV index on screen
                let uvi_index = `${uvi.value}`;
                uvIndex.innerHTML = uvi_index;

                if(uvi_index < 2) {
                    //Low=green
                    uvIndex.style = "background-color: green";
                }
                else if (uvi_index < 8) {
                    //Moderate
                    uvIndex.style = "background-color: yellow";
                }
                else {
                    //High
                    uvIndex.style = "background-color: red";
                };
            });

        // Fetch the 5 day forecast
        fetch(`${api.base}forecast?q=${currentCity}&cnt=5&units=imperial&appid=${api.key}`)
            .then(forecast => {
                return forecast.json();
            })
            .then(displayForecast);


    };

    const displayForecast = (forecast) => {
        // 5 Days of forecast
        for (let i = 0; i < 5; i++) {
            var date = `${forecast.list[i].dt_txt}`;
            var temp = `${(forecast.list[i].main.temp).toFixed(2)}`;
            var humidity = `${forecast.list[i].main.humidity}`;
            var icon = `${forecast.list[i].weather[0].icon}`;
            var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";


            loadForecasts(i+1, date, temp, humidity, iconUrl);
        }
    };

    const loadForecasts = (i, date, temp, humidity, iconUrl) => {

        let pDay = document.getElementById("date-day" + i);
        pDay.innerHTML = date.split(" ", 1);


        var iconImg = document.getElementById("icon-day" + i);
        iconImg.src = iconUrl;


        let pTemp = document.getElementById("temp-day" + i);
        pTemp.innerHTML = "Temp: " + temp + " °F"

        let pHumidity = document.getElementById("humidity-day" + i);
        pHumidity.innerHTML = "Humidity: " + humidity + "%";

    };



// ------------------------------------------------------------------------------

