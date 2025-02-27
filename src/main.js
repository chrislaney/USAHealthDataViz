import { drawScatterPlot } from './charts/scatterPlot.js';
import { drawBarChart } from './charts/barchart.js';
import { drawChoropleth } from './charts/choropleth.js';

// Global variable to store the selected metric
let selectedMetric = "percent_stroke";
let metricLabel = ""

const metricLabels = {
    median_household_income: "Median Household Income $",
    percent_stroke: "% w/ Stroke",
    percent_coronary_heart_disease: "% w/ Coronary Heart Disease",
    percent_high_blood_pressure: "% w/ High Blood Pressure",
    percent_high_cholesterol: "% w/ High Cholesterol",
  };


// document.addEventListener("DOMContentLoaded", function () {
//     metricLabel = metricLabels[selectedMetric] || selectedMetric;
//     // Initial draw for all charts
//     updateCharts();

//     // Listen for changes in the dropdown
//     d3.select("#metricSelector").on("change", function () {
//         selectedMetric = d3.select(this).property("value"); // Get the selected value
//         metricLabel = metricLabels[selectedMetric] || selectedMetric;
//         updateCharts(); // Redraw all charts with new metric
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    metricLabel = metricLabels[selectedMetric] || selectedMetric;
    
    // Initial draw for all charts
    updateCharts();

    // Listen for button clicks instead of dropdown changes
    d3.selectAll(".metric-btn").on("click", function () {
        selectedMetric = d3.select(this).attr("data-value"); // Get the selected metric from data-value
        metricLabel = metricLabels[selectedMetric] || selectedMetric;
        
        console.log(`Metric selected: ${selectedMetric}`); // Debugging
        updateCharts(); // Redraw all charts with the new metric
    });
});





// Function to update all charts based on selected metric
function updateCharts() {
    d3.select("#scatterplotplot").html(""); // Clear previous scatterplot
    d3.select("#barchartchart").html(""); // Clear previous bar chart
    // d3.select("#choropleth").html(""); // Clear previous choropleth

    // Redraw charts with the new metric
    drawScatterPlot("scatterplotplot", selectedMetric, metricLabel);
    drawBarChart("barchartchart", selectedMetric, metricLabel);
    drawChoropleth("choropleth", selectedMetric, metricLabel);
}
