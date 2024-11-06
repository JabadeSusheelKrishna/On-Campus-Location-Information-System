var geo_coordinates = [17.448220375648397, 78.34854556228062];
var zoom_level = 17;
var map = L.map('map').setView(geo_coordinates, zoom_level);    // Defining map

// ---------------- Streets Map ----------------------
// L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=W30t0ZeQyX7EXYfwIp22', {
//     maxZoom: 22,
//     attribution: 'By Susheel'
// }).addTo(map);

// ---------------- Custom Map -----------------------
// L.tileLayer('../Tile_Out/{z}/{x}/{y}.png', {
//     maxZoom: 18,
//     attribution: 'Custom Tiling Only'
// }).addTo(map);

// ---------------- Open Street Map ------------------
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'openstreet maps'
}).addTo(map);

// Function to handle clicks on features and add popup
var click_handling = (feature, layer) => {
    layer.bindPopup(
        `<h1>${feature.properties.name}</h1>
                <img src="${feature.properties.image}" class="popup-image">
                <p>${feature.properties.details}</p>`,
        { maxWidth: 300 } // Increase popup width if necessary
    );
}

// Load GeoJSON data from external file
axios.get('buildings.geojson')
    .then(function (response) {
        // Add GeoJSON data to the map and implement click event
        L.geoJSON(response.data, {
            onEachFeature: click_handling
        }).addTo(map);
    })
    .catch(function (error) {
        console.error("Error loading GeoJSON data: ", error);
    });