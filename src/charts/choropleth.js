export function drawChoropleth(containerID, selectedMetric, metricLabel) {
    console.log("containerID:", containerID);
    Promise.all([
      d3.json('data/counties-10m.json'),
      d3.csv('data/parsed_health_data.csv')
    ]).then(data => {
      const geoData = data[0];  // Assign TopoJSON data
      const healthData = data[1]; // Assign CSV data

  
      // Combine datasets by adding median_household_income and cnty_name
      geoData.objects.counties.geometries.forEach(d => {
        for (let i = 0; i < healthData.length; i++) {
          if (d.id === healthData[i].cnty_fips) {
            d.properties.median_household_income = +healthData[i].median_household_income;
            d.properties.cnty_name = healthData[i].cnty_name; // Add county name
            d.properties.percent_stroke = +healthData[i].percent_stroke;
            d.properties.percent_coronary_heart_disease = +healthData[i].percent_coronary_heart_disease;
            d.properties.percent_high_blood_pressure = +healthData[i].percent_high_blood_pressure;
            d.properties.percent_high_cholesterol = +healthData[i].percent_high_cholesterol;
          }
        }
      });
  
      // Initial Choropleth map rendering
      d3.select("#choropleth").html(""); // Clear previous choropleth
      new ChoroplethMap({ parentElement:`#${containerID}`}, geoData, selectedMetric, metricLabel);
    })
    .catch(error => console.error("Error loading data:", error));
  }
  


export class ChoroplethMap {
    constructor(_config, _data, _metric, _metricLabel) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 800,
        containerHeight: _config.containerHeight || 800,
        margin: _config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
        tooltipPadding: 10,
        legendBottom: 50,
        legendLeft: 50,
        legendRectHeight: 12,
        legendRectWidth: 150
      };
  
      this.data = _data;
      this.us = _data;
      this.active = d3.select(null);
      this.metric = _metric;
      this.metricLabel = _metricLabel;
      console.log(this.metricLabel)
      
      console.log(`ChoroplethMap received geoData with metric: ${this.metric}`, this.data);
  
      this.initVis();
      console.log("Sample from choropleth:", this.data.objects.counties.geometries[0]);
    }
  
    initVis() {
      let vis = this;
  
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      vis.svg = d3.select(vis.config.parentElement).append('svg')
        .attr('class', 'center-container')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);
  
      vis.svg.append('rect')
        .attr('class', 'background center-container')
        .attr('height', vis.config.containerWidth ) //height + margin.top + margin.bottom)
        .attr('width', vis.config.containerHeight) //width + margin.left + margin.right)
        .style('fill', 'none')
        .on('click', vis.clicked);
  
      vis.projection = d3.geoAlbersUsa()
        .translate([vis.width / 2, vis.height / 2])
        .scale(vis.width);
      
      console.log("Extent for metric", this.metric, d3.extent(this.data.objects.counties.geometries, d => d.properties[this.metric]));
  
      vis.colorScale = d3.scaleLinear()
        .domain(d3.extent(vis.data.objects.counties.geometries, d => d.properties[this.metric]))
        .range(['#cfe2f2', '#0d306b'])
        .interpolate(d3.interpolateHcl);
  
      vis.path = d3.geoPath()
        .projection(vis.projection);
  
      vis.g = vis.svg.append("g")
        .attr('class', 'center-container center-items us-state')
        .attr('transform', 'translate('+vis.config.margin.left+','+vis.config.margin.top+')')
        .attr('width', vis.width + vis.config.margin.left + vis.config.margin.right)
        .attr('height', vis.height + vis.config.margin.top + vis.config.margin.bottom)
    

      vis.counties = vis.g.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(topojson.feature(vis.us, vis.us.objects.counties).features)
        .enter().append("path")
        .attr("d", vis.path)
        // .attr("class", "county-boundary")
        .attr('fill', d => {
              if (d.properties[this.metric]) {
                return vis.colorScale(d.properties[this.metric]);
              } else {
                return 'url(#lightstripe)';
              }
            });
  
      vis.counties
            .on('mousemove', (event , d) => {
                const metricData = d.properties[this.metric] ? `<strong>${d.properties[this.metric]}</strong> ${this.metricLabel}` : 'No data available'; 
                d3.select('#tooltip')
                  .style('display', 'block')
                  .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                  .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                  .html(`
                    <div class="tooltip-title">${d.properties.name}</div>
                    <div>${metricData}</div>
                  `);
              })
              .on('mouseleave', () => {
                d3.select('#tooltip').style('display', 'none');
              });
  
  
  
          vis.g.append("path")
            .datum(topojson.mesh(vis.us, vis.us.objects.states, function(a, b) { return a !== b; }))
            .attr("id", "state-borders")
            .attr("d", vis.path);    
  
      
    }
  
   }
  
  