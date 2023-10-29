

let loader = document.getElementById("loading-item");


let api_key = "37bf2c1109e88abd6360835f1bae2db5"

aircraft_data = {
    B736: {
        name: "Boeing 737-600",
        averageSpeed: 850, // kmph
        fuelPerKm: 3.16, //kg
    },
    B737: {
        name: "Boeing 737-700",
        averageSpeed: 876, // kmph
        fuelPerKm: 3.21, //kg
    },
    B738: {
        name: "Boeing 737-800",
        averageSpeed: 842, // kmph
        fuelPerKm: 3.58, //kg
    },
    A320n: {
        name: "Airbus A320neo",
        averageSpeed: 840, // kmph
        fuelPerKm: 2.79, //kg
    },
    A321n: {
        name: "Airbus A321neo",
        averageSpeed: 833, // kmph
        fuelPerKm: 3.30, //kg
    },
    C172: {
        name: "Cessna 172",
        averageSpeed: 226, //kmph
        fuelPerKm: 0.03, //kg

},
C152: {
    name: "Cessna 152",
    averageSpeed: 198, //kmph
    fuelPerKm: 0.03, //kg


},

}


function calculateDistance(event){

    event.preventDefault();
    let start = document.getElementById("start").value.toUpperCase();
    let end = document.getElementById("end").value.toUpperCase();
    let airportData = []
            // loader.style.display = "flex";          


    fetch('airports.json')
        .then(response => response.text())
        .then(data => {
            JSON.parse(data).forEach(airport => {
                if(airport.gps_code == start || airport.gps_code == end){
                    airportData.push(airport);
                }
            });
            if (airportData.length < 2){
                alert("An Airport ICAO is invaild");
                return;
            }

            units = document.getElementById("units").value;
            lat1 = airportData[0].latitude_deg;
            lon1 = airportData[0].longitude_deg;
            lat2 = airportData[1].latitude_deg;
            lon2 = airportData[1].longitude_deg;
            let R = 6371
            let dLat = (lat2-lat1) * Math.PI / 180;
            let dLon = (lon2-lon1) * Math.PI / 180;
            let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            let d = R * c;
            let unit_symbol = "km"
            d_km = d;
            if(units == "sm"){
                d = d * 0.621371;
                unit_symbol = "miles"
            } else if(units == "nm"){
                d = d * 0.539957;
                unit_symbol = "nm"
            }

            let plane = document.getElementById("aircraft").value;
            time = d_km / aircraft_data[plane].averageSpeed;            
            


            results_div = document.getElementById("result");
            results_div.style.display = "block";


            // Weather data
            fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat1 + '&lon=' + lon1 + '&appid=' + api_key)
            .then(response => response.json())
            .then(data => {
                let temp = data.main.temp - 273.15;
                if (document.getElementById("corf").value == "f") {
                    temp = (temp * 9/5) + 32;
                    var symbol = "°F"
                } else {
                    var symbol = "°C"
                }
                
                weatherResult = document.getElementById("weather1");
                weatherResult.innerHTML = data.weather[0].description + "<br/>" + (temp).toFixed(2) + symbol + "<br/>" + (data.wind.speed*1.944).toFixed(2) + "knots/s @ " + data.wind.deg + "°";
            })
            .catch(error => console.log(error));

            fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat2 + '&lon=' + lon2 + '&appid=' + api_key)
            .then(response => response.json())
            .then(data => {
                temp = data.main.temp - 273.15;
                if (document.getElementById("corf").value == "f") {
                    temp = (temp * 9/5) + 32;
                    var symbol = "°F"
                } else {
                    var symbol = "°C"
                }

                weatherResult = document.getElementById("weather2");
                weatherResult.innerHTML = data.weather[0].description + "<br/>" + (temp).toFixed(2) + symbol +"<br/>" + (data.wind.speed*1.944).toFixed(2) + "knots/s @ " + data.wind.deg + "°";
            })
            .catch(error => console.log(error));




            // loader.style.display = "none";
            saresult = document.getElementById("start-airport");
            saresult.innerHTML = start + " - " + airportData[0].name + "<br/>" + airportData[0].type + " - " +  airportData[0].continent;
            earresult = document.getElementById("end-airport");
            earresult.innerHTML = end + " - " +  airportData[1].name + "<br/>" + airportData[1].type + " - " +  airportData[1].continent;
            distanceResult = document.getElementById("distance");
            distanceResult.innerHTML = "Distance: " + d.toFixed(2) + " " + unit_symbol;
            timeResult = document.getElementById("flight-time");
            timeResult.innerHTML = "Time: " + (time / 0.60).toFixed(2) + " hours";
            fuelResult = document.getElementById("fuel");
            fuelAmount = (d_km * aircraft_data[plane].fuelPerKm).toFixed(2);
            if (document.getElementById("lborkg").value == "lb") {
                fuelAmount = fuelAmount * 2.20462;
                fuelResult.innerHTML = "Fuel: " + (fuelAmount).toFixed(2) + " lb";
            } else {
                fuelResult.innerHTML = "Fuel: " + fuelAmount + " kg <br/>" + (fuelAmount / 1000).toFixed(2) + " Tons";

            }
            

            
        })
        .catch(error => console.log(error));

    


}