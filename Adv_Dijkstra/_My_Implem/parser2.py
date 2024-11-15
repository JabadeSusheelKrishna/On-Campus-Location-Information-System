import json

# Load the graphs.json file
with open('graphs.json', 'r') as file:
    graph_data = json.load(file)

# Initialize the new data structure
filtered_graph = {"nodes": graph_data["nodes"], "edges": {}}

# Filter edges based on passability
for source, edges in graph_data["edges"].items():
    filtered_edges = [edge for edge in edges if edge.get("passability") == "Both"]
    if filtered_edges:
        filtered_graph["edges"][source] = filtered_edges

# Write the filtered data to both.json
with open('both.json', 'w') as file:
    json.dump(filtered_graph, file, indent=4)

print("Filtered data has been saved to both.json.")
