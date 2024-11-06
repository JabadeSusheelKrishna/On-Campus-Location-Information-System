import json
import math

def calculate_distance(coord1, coord2):
    # Simple Euclidean distance formula
    return math.sqrt((coord1[0] - coord2[0]) ** 2 + (coord1[1] - coord2[1]) ** 2)

def parse_geojson_to_graph(geojson_data):
    nodes = {}
    edges = {}

    node_count = 0
    coord_to_id = {}  # Map coordinates to node IDs to ensure unique identifiers

    for feature in geojson_data["features"]:
        coords = feature["geometry"]["coordinates"]

        for i in range(len(coords) - 1):
            start = tuple(coords[i])
            end = tuple(coords[i + 1])
            distance = calculate_distance(start, end)

            # Assign a unique id to each node if it’s new
            if start not in coord_to_id:
                coord_to_id[start] = f"Node_{node_count}"
                nodes[coord_to_id[start]] = {"id": coord_to_id[start], "coordinates": start}
                node_count += 1
            if end not in coord_to_id:
                coord_to_id[end] = f"Node_{node_count}"
                nodes[coord_to_id[end]] = {"id": coord_to_id[end], "coordinates": end}
                node_count += 1

            # Build the edges
            node_start = coord_to_id[start]
            node_end = coord_to_id[end]

            if node_start not in edges:
                edges[node_start] = []
            if node_end not in edges:
                edges[node_end] = []

            edges[node_start].append({"target": node_end, "weight": distance})
            edges[node_end].append({"target": node_start, "weight": distance})

    return {"nodes": nodes, "edges": edges}

# Load GeoJSON
with open("Roads_IIIT.geojson", "r") as f:
    geojson_data = json.load(f)

graph_data = parse_geojson_to_graph(geojson_data)

# Save to graphs.json
with open("graphs.json", "w") as f:
    json.dump(graph_data, f, indent=2)
