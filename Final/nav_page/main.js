// Initialize the map
const map = L.map('map').setView([17.4469, 78.3495], 17);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Load Roads.geojson (replace with your own path)
axios.get('Roads_IIIT.geojson').then(response => {
  L.geoJSON(response.data, {
    color: "gray",
    weight: 2
  }).addTo(map);
});

// Load and parse Graphs.json (replace with your own path)
let graphData;

function updateGraphData() {
  const movable = document.getElementById("transportationDropdown").value;

  if (movable === "walk") {
    axios.get('graphs.json').then(response => {
      graphData = response.data;
      console.log("Graph data for walking loaded", graphData);
    });
  } else {
    axios.get('both.json').then(response => {
      graphData = response.data;
      console.log("Graph data for vehicles loaded", graphData);
    });
  }
}

// Initialize graphData based on the default dropdown value
updateGraphData();

function distance_calculator(routeCoords) {
  const R = 6371000;
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  let totalDistance = 0;

  for (let i = 0; i < routeCoords.length - 1; i++) {
    const [lat1, lon1] = routeCoords[i];
    const [lat2, lon2] = routeCoords[i + 1];

    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const deltaLat = toRadians(lat2 - lat1);
    const deltaLon = toRadians(lon2 - lon1);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    totalDistance += distance;
  }

  return totalDistance;
}

// Dijkstra's Algorithm
function dijkstra(graph, start, end) {
  console.log("Called Dijkstra Function");
  const distances = {};
  const times = {};
  const previous = {};
  const nodes = new Set();

  Object.keys(graph.nodes).forEach(node => {
    distances[node] = Infinity;
    times[node] = Infinity;
    previous[node] = null;
    nodes.add(node);
  });
  distances[start] = 0;
  times[start] = 0;

  while (nodes.size) {
    const currentNode = Array.from(nodes).reduce((minNode, node) =>
      distances[node] < distances[minNode] ? node : minNode
    );
    nodes.delete(currentNode);

    if (currentNode === end) break;
    if (distances[currentNode] === Infinity) break;

    const neighbors = graph.edges[currentNode];
    neighbors.forEach(neighbor => {
      const altDistance = distances[currentNode] + neighbor.weight;
      const altTime = times[currentNode] + neighbor.time;
      if (altDistance < distances[neighbor.target]) {
        distances[neighbor.target] = altDistance;
        times[neighbor.target] = altTime;
        previous[neighbor.target] = currentNode;
      }
    });
  }

  const path = [];
  let u = end;
  while (u) {
    path.unshift(u);
    u = previous[u];
  }

  console.log("Completed Dijkstra Call");
  console.log(path);
  return { path: path.length > 1 ? path : null, totalTime: times[end] };
}

function get_coords_from_graph(Nodes_path, graph_data) {
  const coordinates = [];

  Nodes_path.forEach(node => {
    if (graph_data.nodes[node]) {
      const [lon, lat] = graph_data.nodes[node].coordinates;
      coordinates.push([lat, lon]);
    }
  });

  return coordinates;
}


// Route Finder
function findRoute() {
  const startNode = document.getElementById("startNode").value;
  const endNode = document.getElementById("endNode").value;
  // console.log("Start and End : ");
  // console.log(path)

  if (!graphData || !graphData.nodes[startNode] || !graphData.nodes[endNode]) {
    alert("Invalid node IDs.");
    return;
  }
  var movable = document.getElementById("transportationDropdown").value;

  if (movable === "walk") {
    axios.get('graphs.json').then(response => {
      graphData = response.data;
    });
    console.log("AAAAAAAA");
    console.log(movable)
  }
  else{
    axios.get('both.json').then(response => {
      graphData = response.data;
    });
    console.log("BBBBBBBB");
  }

  const { path, totalTime } = dijkstra(graphData, startNode, endNode);
  if (!path) {
    alert("No path found.");
    return;
  }

  const routeCoords = get_coords_from_graph(path, graphData);
  console.log(routeCoords);
  let dis = distance_calculator(routeCoords);
  document.getElementById('distance').innerHTML = Math.floor(dis) + " meters";
  // document.getElementById('time').innerHTML = Math.floor(totalTime) + " seconds";
  L.polyline(routeCoords, { color: "green", weight: 6 }).addTo(map);
}

// Fetch My Location Button Function
// Load the buildings.geojson data
let buildingPolygons = null;
fetch("buildings.geojson")
  .then(response => response.json())
  .then(data => {
    buildingPolygons = data;
  })
  .catch(error => console.error("Error loading buildings.geojson:", error));

// Function to find the building name based on GPS coordinates
function findBuildingName(lat, lon) {
  if (!buildingPolygons) {
    alert("Building data is not loaded.");
    return null;
  }

  const point = turf.point([lon, lat]);
  for (const feature of buildingPolygons.features) {
    const polygon = feature.geometry;
    const buildingName = feature.properties.name;

    console.log(buildingName)

    if (turf.booleanPointInPolygon(point, polygon)) {
      return buildingName; // Return the building name if point is within polygon
    }
  }

  return null; // Return null if no matching polygon found
}

// Fetch My Location Button Function - modified to use building name as the start node
let entrancePoints = null;
fetch("IIIT_Entrances.geojson")
  .then(response => response.json())
  .then(data => {
    entrancePoints = data;
  })
  .catch(error => console.error("Error loading Entrance.geojson:", error));

// Helper function to calculate Euclidean distance between two points
function euclideanDistance(lat1, lon1, lat2, lon2) {
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
}

function fetchMyLocation() {
  // console.log("Fetching location...");
  const latitude = 17.44834027540592;
  const longitude = 78.34839338228943;
  const buildingName = findBuildingName(latitude, longitude);

  if (buildingName && entrancePoints) {
    // Filter entrances that match the building name
    const matchingEntrances = entrancePoints.features.filter(feature => {
      const entranceName = feature.properties['Place Name'];
      // console.log("-----")
      // console.log(buildingName)
      // console.log(entranceName)
      // console.log(entranceName.startsWith(buildingName));
      return entranceName === buildingName || entranceName.startsWith(buildingName);
    });

    console.log("llllllll");
    console.log(matchingEntrances)

    if (matchingEntrances.length === 0) {
      alert("No entrances found for this building.");
      return;
    }

    // Find the nearest entrance if there are multiple
    let nearestEntrance = matchingEntrances[0];
    let minDistance = euclideanDistance(
      latitude,
      longitude,
      nearestEntrance.geometry.coordinates[1],
      nearestEntrance.geometry.coordinates[0]
    );

    matchingEntrances.slice(1).forEach(feature => {
      const entranceLat = feature.geometry.coordinates[1];
      const entranceLon = feature.geometry.coordinates[0];
      const distance = euclideanDistance(latitude, longitude, entranceLat, entranceLon);

      if (distance < minDistance) {
        minDistance = distance;
        nearestEntrance = feature;
      }
    });

    // Set the nearest entrance in the startNode input field
    document.getElementById("startNode").value = nearestEntrance.properties['Place Name'];
  } else {
    alert("Location is not within any known building or entrance data not loaded.");
  }
}

let buildingData = null;
fetch("IIIT_Entrances.geojson")
  .then(response => response.json())
  .then(data => {
    buildingData = data;
    populateArchitectureTypeDropdown();
  })
  .catch(error => console.error("Error loading buildings.geojson:", error));

// Function to populate the Architecture Type dropdown
function populateArchitectureTypeDropdown() {
  const arcTypeDropdown = document.getElementById("arcTypeDropdown");
  const arcTypes = new Set();
  
  // Collect unique architecture types
  buildingData.features.forEach(feature => {
    if (feature.properties.arc_type) {
      arcTypes.add(feature.properties.arc_type);
    }
  });
  
  // Add options to the dropdown
  arcTypes.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    arcTypeDropdown.appendChild(option);
  });

}

// Function to populate the Architecture dropdown based on selected type
function populateArchitectureDropdown() {
  
  const selectedType = document.getElementById("arcTypeDropdown").value;
  const architectureDropdown = document.getElementById("architectureDropdown");
  
  // Clear the current options
  architectureDropdown.innerHTML = '<option value="">Select Architecture</option>';
  
  const startNode = document.getElementById("startNode").value;

  if (!graphData || !graphData.nodes[startNode]) {
    alert("Start node is not valid or graph data is not loaded.");
    return;
  }

  const startCoords = graphData.nodes[startNode].coordinates;

  buildingData.features.forEach(feature => {
    if (feature.properties.arc_type === selectedType) {
      const architectureName = feature.properties['Place Name'];
      console.log(architectureName);
      if (!graphData.nodes[architectureName]) return;

      // Calculate shortest path distance using Dijkstra
      const { path, totalTime } = dijkstra(graphData, startNode, architectureName);
      // const graphDistance = path ? totalTime : "N/A";
      console.log(path)
      const graphDistance = distance_calculator(get_coords_from_graph(path, graphData))
      // console.log("hhhh");
      // console.log(path)

      // Create dropdown option with only graph distance
      const option = document.createElement("option");
      option.value = architectureName;
      option.textContent = `${architectureName} - Distance: ${graphDistance}m`;
      architectureDropdown.appendChild(option);
    }
  });
}

// Function to set the selected architecture as the end node
function setEndNode() {
  const selectedArchitecture = document.getElementById("architectureDropdown").value;
  document.getElementById("endNode").value = selectedArchitecture;
}



async function loadNodes() {
  try {
      const response = await fetch('graphs.json');
      const data = await response.json();

      // Populate the datalist with valid node IDs
      const datalist = document.getElementById('nodeList');
      datalist.innerHTML = ''; // Clear any existing options

      for (const nodeId in data.nodes) {
          // Only include node IDs that don't match the pattern "Node_<number>"
          if (!/^Node_\d+$/.test(nodeId)) {
              const option = document.createElement('option');
              option.value = nodeId;
              datalist.appendChild(option);
          }
      }
  } catch (error) {
      console.error("Error loading nodes:", error);
  }
}
// Call loadNodes when the page loads
document.addEventListener('DOMContentLoaded', loadNodes);
