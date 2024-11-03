var geo_coordinates = [17.448220375648397, 78.34854556228062];
var zoom_level = 19;
var map = L.map('map').setView(geo_coordinates, zoom_level);    // Defining map

L.tileLayer('https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=W30t0ZeQyX7EXYfwIp22', {
    maxZoom: 22,
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

// L.tileLayer('', {
//     maxZoom: 24,  // Higher zoom level here
//     minZoom: 0,
// }).addTo(map);
