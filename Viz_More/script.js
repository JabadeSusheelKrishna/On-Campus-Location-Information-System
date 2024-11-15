var geo_coordinates = [17.448220375648397, 78.34854556228062];
var zoom_level = 17;
var map = L.map('map').setView(geo_coordinates, zoom_level);

// ---------------- Open Street Map ------------------
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'openstreet maps'
}).addTo(map);

// Define variables for layers
var greenaryLayer, playgroundLayer, buildings;

// Load "greenary.geojson"
axios.get('greenary.geojson')
    .then(function (response) {
        greenaryLayer = L.geoJSON(response.data, {
            onEachFeature: click_handling,
            style: { color: "green" } // Optional styling for greenary
        });
    })
    .catch(function (error) {
        console.error("Error loading greenary.geojson: ", error);
    });

// Load "playground.json"
axios.get('playgrounds.geojson')
    .then(function (response) {
        playgroundLayer = L.geoJSON(response.data, {
            onEachFeature: click_handling,
            style: { color: "blue" } // Optional styling for playground
        });
    })
    .catch(function (error) {
        console.error("Error loading playground.json: ", error);
    });

// Function to handle clicks on features and add popup
var click_handling = (feature, layer) => {
    layer.bindPopup(
        `<h1>${feature.properties.name}</h1>
                <img src="${feature.properties.image}" class="popup-image">
                <p>${feature.properties.details}</p>`,
        { maxWidth: 300 } // Increase popup width if necessary
    );
};

// Load GeoJSON data for buildings
axios.get('buildings.geojson')
    .then(function (response) {
        var buildingsLayer = L.geoJSON(response.data, {
            onEachFeature: click_handling, // Adds popup for each feature
            style: { color: "red", weight: 2 } // Optional style for buildings
        });

        // Add to map initially
        buildingsLayer.addTo(map);

        // Optional: Store in global scope if toggling or further control is needed
        window.buildingsLayer = buildingsLayer;
    })
    .catch(function (error) {
        console.error("Error loading buildings.geojson: ", error);
    });


// Function to update visible layer
function updateLayer(selectedLayer) {
    // Remove all layers first
    if (greenaryLayer) map.removeLayer(greenaryLayer);
    if (playgroundLayer) map.removeLayer(playgroundLayer);
    if (buildingsLayer) map.removeLayer(buildingsLayer);

    // Add the selected layer
    if (selectedLayer === "greenary" && greenaryLayer) {
        greenaryLayer.addTo(map);
    } else if (selectedLayer === "playground" && playgroundLayer) {
        playgroundLayer.addTo(map);
    } else if (selectedLayer === "building" && buildingsLayer) {
        buildingsLayer.addTo(map);
    }

}
