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

  // Populate buildings of the selected type
  buildingData.features.forEach(feature => {
    if (feature.properties.arc_type === selectedType) {
      const option = document.createElement("option");
      option.value = feature.properties.name;
      option.textContent = feature.properties.name;
      architectureDropdown.appendChild(option);
    }
  });
}

// Function to set the selected architecture as the end node
function setEndNode() {
  const selectedArchitecture = document.getElementById("architectureDropdown").value;
  document.getElementById("endNode").value = selectedArchitecture;
}
