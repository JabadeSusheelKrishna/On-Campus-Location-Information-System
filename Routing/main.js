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

// Dijkstra's Algorithm
function dijkstra(graph, start, end) {
  console.log("Called Dijkstra Function")
  const distances = {};
  const previous = {};
  const nodes = new Set();

  Object.keys(graph.nodes).forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
    nodes.add(node);
  });
  distances[start] = 0;

  while (nodes.size) {
    const currentNode = Array.from(nodes).reduce((minNode, node) =>
      distances[node] < distances[minNode] ? node : minNode
    );
    nodes.delete(currentNode);

    if (currentNode === end) break;
    if (distances[currentNode] === Infinity) break;

    const neighbors = graph.edges[currentNode];
    neighbors.forEach(neighbor => {
      const alt = distances[currentNode] + neighbor.weight;
      if (alt < distances[neighbor.target]) {
        distances[neighbor.target] = alt;
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
  console.log("Completed Dijkstra Call")
  console.log(path)
  return path.length > 1 ? path : null;
}

function get_coords_from_graph(Nodes_path, graph_data) {
  const coordinates = [];
  
  Nodes_path.forEach(node => {
    if (graph_data.nodes[node]) {
      const [lon, lat] = graph_data.nodes[node].coordinates;
      coordinates.push([lat, lon]); // Swapping to [latitude, longitude]
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

  const path = dijkstra(graphData, startNode, endNode);
  if (!path) {
    alert("No path found.");
    return;
  }


  // const routeCoords = path.map(node => graphData.nodes[node].coordinates);
  const routeCoords = get_coords_from_graph(path, graphData)
  console.log(routeCoords)
  L.polyline(routeCoords, { color: "green", weight: 6 }).addTo(map);
  // L.polyline(routeCoords).addTo(map);
}
