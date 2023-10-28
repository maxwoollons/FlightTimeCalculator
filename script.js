
let loader = document.getElementById("loading-item");

aircraft_data = {
    B736: {
        name: "Boeing 737-600",
        maxPassengers: 149,
        averageSpeed: 969.318, // kmph
    },
    C172: {
        name: "Cessna 172",
        maxPassengers: 4,
        averageSpeed: 226, //kmph
},
C152: {
    name: "Cessna 152",
    maxPassengers: 2,
    averageSpeed: 198, //kmph
}
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


            // loader.style.display = "none";
            saresult = document.getElementById("start-airport");
            saresult.innerHTML = start + " - " + airportData[0].name + "<br/>" + airportData[0].type + " - " +  airportData[0].continent;
            earresult = document.getElementById("end-airport");
            earresult.innerHTML = end + " - " +  airportData[1].name + "<br/>" + airportData[1].type + " - " +  airportData[1].continent;
            distanceResult = document.getElementById("distance");
            distanceResult.innerHTML = "Distance: " + d.toFixed(2) + " " + unit_symbol;
            timeResult = document.getElementById("flight-time");
            timeResult.innerHTML = "Time: " + (time / 0.60).toFixed(2) + " hours";
            

            
        })
        .catch(error => console.log(error));

    


}