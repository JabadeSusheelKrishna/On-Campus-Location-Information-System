import json
import math

# Load GeoJSON data
with open('IIIT_Entrances.geojson', 'r') as geojson_file:
    geojson_data = json.load(geojson_file)

# Load Graphs.json data
with open('graphs.json', 'r') as graphs_file:
    graphs_data = json.load(graphs_file)

# Helper function to calculate the Euclidean distance between two points
def calculate_distance(coord1, coord2):
    return math.sqrt((coord1[0] - coord2[0])**2 + (coord1[1] - coord2[1])**2)

# Process each feature in the GeoJSON file
for feature in geojson_data['features']:
    target_coordinates = feature['geometry']['coordinates']
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
        print(f"No nodes found for feature with place name '{place_name}'. Skipping...")
        continue

    # Check if the Place Name already exists as a node to avoid duplicates
    if place_name in graphs_data['nodes']:
        print(f"The place name '{place_name}' already exists as a node in Graphs.json. Skipping...")
        continue

    # Rename the closest node to the Place Name from GeoJSON
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
                'weight': edge['weight']
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

print("Nodes have been renamed to their respective 'Place Name' values in Graphs.json.")
