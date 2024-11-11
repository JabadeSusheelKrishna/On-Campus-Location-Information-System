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
axios.get('graphs.json').then(response => {
  graphData = response.data;
});

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

  if (!graphData || !graphData.nodes[startNode] || !graphData.nodes[endNode]) {
    alert("Invalid node IDs.");
    return;
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
// Fetch My Location Button Function - modified to use hardcoded coordinates as the start node
function fetchMyLocation() {
  console.log("HEllo")
  const latitude = 17.446702949925296;
  const longitude = 78.34955168529042;
  const buildingName = findBuildingName(latitude, longitude);
  
  if (buildingName) {
    document.getElementById("startNode").value = buildingName; // Set the building name as the start node
  } else {
    alert("Location is not within any known building.");
  }
}
