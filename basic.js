var geo_coordinates = [17.448220375648397, 78.34854556228062];
var zoom_level = 17;
var map = L.map('map').setView(geo_coordinates, zoom_level);    // Defining map
L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=W30t0ZeQyX7EXYfwIp22', {
    maxZoom: 22,
    attribution: 'By Susheel'
}).addTo(map);

// --------- Uncomment this if you want to use custom tiles ---------
// L.tileLayer('./Tile_Out/{z}/{x}/{y}.png', {
//     maxZoom: 18,
//     attribution: 'Custom Tiling Only'
// }).addTo(map);
// ------------------------------------------------------------------

var Bakul = L.polygon(bakul_nivas["coordinates"]).addTo(map);
Bakul.on('click', Bakul_det_printer);

var T_Hub = L.polygon(T_Hub_details["coordinates"]).addTo(map);
T_Hub.on('click', T_Hub_det_printer);

document.querySelector(".close-btn").addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
 });