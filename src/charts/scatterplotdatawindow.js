
const states = Array.from(new Set(data.map(d => d.state_name))); // Get unique states

const stateFilterContainer = d3.select("#stateFilterContainer");

// Create a section with all states and checkboxes
const stateCheckboxes = stateFilterContainer.select("#stateCheckboxes")
    .selectAll("div")
    .data(states)
    .enter().append("div")
    .attr("class", "state-option");

stateCheckboxes.append("input")
    .attr("type", "checkbox")
    .attr("id", d => "checkbox-" + d)
    .attr("value", d => d)
    .on("change", function(event, d) {
        toggleStateSelection(d, this.checked);
    });

stateCheckboxes.append("label")
    .attr("for", d => "checkbox-" + d)
    .text(d => d);

    let selectedStates = []; // To store selected states

    function toggleStateSelection(state, isSelected) {
        if (isSelected) {
            selectedStates.push(state); // Add state to selected states
        } else {
            selectedStates = selectedStates.filter(s => s !== state); // Remove state from selected states
        }
    
        updateSelectedStatesUI(); // Update UI with selected states
        updateScatterplot(selectedStates); // Update the scatterplot with the selected states
    }
    
    function updateSelectedStatesUI() {
        // Update the "Selected States" section
        const selectedSection = d3.select("#selectedStates");
        selectedSection.selectAll("div").remove(); // Clear current selection
    
        selectedSection.selectAll("div")
            .data(selectedStates)
            .enter().append("div")
            .text(d => d);  // Display selected states
    }
    
