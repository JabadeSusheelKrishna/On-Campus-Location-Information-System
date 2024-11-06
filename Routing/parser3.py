import json
import math

# Load geojson data
with open('IIIT_Entrances.geojson', 'r') as geojson_file:
    geojson_data = json.load(geojson_file)

# Load Graphs.json data
with open('graphs.json', 'r') as graphs_file:
    graphs_data = json.load(graphs_file)

# Extract target coordinates from geojson file
target_coordinates = geojson_data['features'][0]['geometry']['coordinates']

# Helper function to calculate the Euclidean distance between two points
def calculate_distance(coord1, coord2):
    return math.sqrt((coord1[0] - coord2[0])**2 + (coord1[1] - coord2[1])**2)

# Find the closest node to the target coordinates
closest_node = None
min_distance = float('inf')
for node_id, node_info in graphs_data['nodes'].items():
    node_coordinates = node_info['coordinates']
    distance = calculate_distance(node_coordinates, target_coordinates)
    if distance < min_distance:
        min_distance = distance
        closest_node = node_id

# Rename the closest node to "Nilgiri-3"
if closest_node:
    # Update the node in 'nodes' section
    graphs_data['nodes']['Nilgiri-3'] = graphs_data['nodes'].pop(closest_node)
    graphs_data['nodes']['Nilgiri-3']['id'] = "Nilgiri-3"
    
    # Update references in the 'edges' section
    new_edges = {}
    for node, edges in graphs_data['edges'].items():
        # Rename the key if it's the closest node
        node_key = "Nilgiri-3" if node == closest_node else node
        updated_edges = []
        for edge in edges:
            # Update the target node in each edge if it's the closest node
            edge['target'] = "Nilgiri-3" if edge['target'] == closest_node else edge['target']
            updated_edges.append(edge)
        new_edges[node_key] = updated_edges
    graphs_data['edges'] = new_edges

# Save the updated Graphs.json file
with open('updated_graphs_file_path.json', 'w') as updated_graphs_file:
    json.dump(graphs_data, updated_graphs_file, indent=4)

print("Node renamed to 'Nilgiri-3' and saved in the updated Graphs.json file.")
