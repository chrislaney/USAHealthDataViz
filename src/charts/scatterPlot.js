// scatterplot.js

export function drawScatterPlot(containerId, metric, metricLabel) {
    // Set dimensions for the scatter plot
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };
    const width = document.getElementById(containerId).clientWidth - margin.left - margin.right;
    const height = document.getElementById(containerId).clientHeight - margin.top - margin.bottom;

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Read Data 
    d3.csv("./data/parsed_health_data.csv").then(function(data) {

        console.log(metric)
        const incomeExtent = d3.extent(data, d => +d.median_household_income);
        const ymetricExtent = d3.extent(data, d => +d[metric]);

    // Create the scales
    const xScale = d3.scaleLinear()
        .domain(incomeExtent)  // Set domain to min and max income
        .range([0, width]);    // Set range based on plot width

    const yScale = d3.scaleLinear()
        .domain(ymetricExtent)  // Set domain to min and max stroke percentage
        .range([height, 0]);   // Set range based on plot height (y is inverted in SVG)

    // Create the X axis
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d => d / 1000 + "k"); 

    // Create the Y axis
    const yAxis = d3.axisLeft(yScale)
    .tickFormat(d => {
        // Only show whole numbers, filter out non-whole numbers
        return d % 1 === 0 ? `${d}%` : " ";  // If the value is a whole number, show it; otherwise, hide it
    });

    // Append X Axis to the SVG
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    // Append Y Axis to the SVG
    svg.append("g")
        .call(yAxis);

    svg.append("text")
        .attr("class", "plot-title")
        .attr("x", width / 2)  // Center horizontally
        .attr("y", -20)  // Position it a bit above the plot
        .attr("text-anchor", "middle")  // Center text
        .style("font-size", "16px")  // Adjust font size
        .style("font-weight", "bold")  // Optional: make the title bold
        .text(`Median Income vs ${metricLabel} `);

    // Plot the scatterplot points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(+d.median_household_income)) // Use xScale for the x position
        .attr("cy", d => yScale(+d[metric]))          // Use yScale for the y position
        .attr("r", 2)                                       // Set the radius of each point
        .attr("fill", "steelblue")                         // Set the color of the points
        .on("mouseover", function(event, d) {
            // Show the tooltip with the county name
            tooltip.style("visibility", "visible")
                .html(d.cnty_name + " County" + '<br>Income: $' + d.median_household_income +  "<br>" + d[metric] + `${metricLabel}: ` )
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", function(event) {
            // Move the tooltip with the mouse
            tooltip.style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            // Hide the tooltip when mouse leaves the point
            tooltip.style("visibility", "hidden");
        });
    });

    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "lightgray")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("opacity", 0.8);

}