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
        time_for_road = 5

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

            edges[node_start].append({"target": node_end, "weight": distance, "time": time_for_road})
            # edges[node_end].append({"target": node_start, "weight": distance})

    return {"nodes": nodes, "edges": edges}

# Load GeoJSON
with open("Roads_IIIT.geojson", "r") as f:
    geojson_data = json.load(f)

graph_data = parse_geojson_to_graph(geojson_data)

# Save to graphs.json
with open("graphs.json", "w") as f:
    json.dump(graph_data, f, indent=2)

# Load GeoJSON data
with open('IIIT_Entrances.geojson', 'r') as geojson_file:
    geojson_data = json.load(geojson_file)

# Load Graphs.json data
with open('graphs.json', 'r') as graphs_file:
    graphs_data = json.load(graphs_file)

# Process each feature in the GeoJSON file
for feature in geojson_data['features']:
    target_coordinates = feature['geometry']['coordinates']
    print(feature['properties'])
    place_name = feature['properties']['Place Name']

    # Find the closest node to the target coordinates
    closest_node = None
    min_distance = float('inf')
    for node_id, node_info in graphs_data['nodes'].items():
        node_coordinates = node_info['coordinates']
        distance = calculate_distance(node_coordinates, target_coordinates)
        if distance < min_distance:
            min_distance = distance
            closest_node = node_id

    if not closest_node:
        print(f"No nodes found for feature with name '{place_name}'. Skipping...")
        continue

    # Check if the name already exists as a node to avoid duplicates
    if place_name in graphs_data['nodes']:
        print(f"The name '{place_name}' already exists as a node in Graphs.json. Skipping...")
        continue

    # Rename the closest node to the name from GeoJSON
    # Update the node in the 'nodes' section
    graphs_data['nodes'][place_name] = graphs_data['nodes'].pop(closest_node)
    graphs_data['nodes'][place_name]['id'] = place_name

    # Update references in the 'edges' section
    new_edges = {}
    for node, edges in graphs_data['edges'].items():
        # Rename the key if it's the closest node
        node_key = place_name if node == closest_node else node
        updated_edges = []
        for edge in edges:
            # Update the target node in each edge if it's the closest node
            updated_target = place_name if edge['target'] == closest_node else edge['target']
            updated_edges.append({
                'target': updated_target,
                'weight': edge['weight'],
                'time': edge.get('time')  # Include 'time' attribute if it exists
            })
        new_edges[node_key] = updated_edges
    graphs_data['edges'] = new_edges

    # Additionally, update targets in other nodes' edges where the closest node was a target
    for node, edges in graphs_data['edges'].items():
        for edge in edges:
            if edge['target'] == closest_node:
                edge['target'] = place_name

# Save the updated Graphs.json file
with open('graphs.json', 'w') as updated_graphs_file:
    json.dump(graphs_data, updated_graphs_file, indent=4)

print("Nodes have been renamed to their respective 'name' values in Graphs.json.")
