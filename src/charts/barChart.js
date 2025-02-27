// bar chart
// barchart.js

export function drawBarChart(containerId, metric, metricLabel) {
    // Set dimensions for the bar chart
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };
    const width = document.getElementById(containerId).clientWidth - margin.left - margin.right;
    const height = document.getElementById(containerId).clientHeight - margin.top - margin.bottom;

    const container = d3.select(`#${containerId}`);
    container.selectAll("*").remove(); // This will clear any existing SVG elements

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Read Data and calculate the extents and bins
    d3.csv("./data/parsed_health_data.csv").then(function(data) {
        // Calculate extents for the selected metric
        const metricExtent = d3.extent(data, d => +d[metric]);

        // Calculate histogram bins
        const histogram = d3.histogram()
            .domain(metricExtent)
            .thresholds(d3.thresholdFreedmanDiaconis);

        const bins = histogram(data.map(d => +d[metric]));

        // Create scales for x and y axes
        const xScale = d3.scaleLinear()
            .domain(metricExtent)  // Set domain to min and max metric values
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)]) // Set domain based on the maximum bin count
            .range([height, 0]);

        let xTickFormat;
        let yTickFormat;
    
        if (metric === 'median_household_income') {
            // For income, divide by 1000 and append "k"
            xTickFormat = d => `${d / 1000}k`;
        } else if (metric.includes('percent')) {
            // For percentage metrics, show percentage with a "%" sign
            xTickFormat = d => `${d}%`;
        }

        // Create the X axis
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(xTickFormat) // Apply the dynamic tick format
            .ticks(10)

        // Create the Y axis
        const yAxis = d3.axisLeft(yScale)
            .ticks(5); // Adjust the number of ticks if needed

        // Append X Axis to the SVG
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        // Append Y Axis to the SVG
        svg.append("g")
            .call(yAxis);

        // Title text
        svg.append("text")
            .attr("class", "plot-title")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "Roboto")
            .style("font-weight", "bold")
            .text(`${metricLabel} Distribution`);

        // Plot the bars
        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", d => xScale(d.x1) - xScale(d.x0)) // Width based on bin size
            .attr("height", d => height - yScale(d.length)) // Height based on frequency
            .attr("fill", "steelblue");
    });
}
