// Initialize the map
var latitude = 17.44570282183121;
var longitude = 78.3489157924657;
var zoomLevel = 17;
var map = L.map('map').setView([latitude, longitude], zoomLevel); // Set initial coordinates and zoom level

// Add tile layer
L.tileLayer('./Tile_Out/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 15,
    bounds: [[17.4, 78.3], [17.5, 78.4]], // Optional: Set bounds to limit map extent
    noWrap: true // Prevents the map from wrapping infinitely
}).addTo(map);