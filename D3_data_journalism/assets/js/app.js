// @TODO: YOUR CODE HERE!
// Set svg dimensions
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .classed(".chart",true);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Select Initial variables
var chosenXvar = "poverty";
var chosenYvar = "healthcare";

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData){

    // Step 1: Parse Data/Cast as numbers
    healthData.forEach(data => {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.income = +data.income;
    });

    // Step 2: Create scale functions
    var xScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty) * .9,d3.max(healthData,d => d.poverty)])
        .range([0,width])
        .nice();

    var yScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.healthcare * 0.8),d3.max(healthData, d => d.healthcare)])
        .range([height,0])
        .nice();

    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis  = d3.axisLeft(yScale);

    // Step 4: Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("x-axis", true)
        .call(bottomAxis);

    chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis)
        ;

    // step 5: Create Circles
    var circlesGroup = chartGroup.
        selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "12")
        .attr("class", "stateCircle")
        .attr("stoke-width","1")
        .attr("opacity", "0.75");
    
    var circleLabels = chartGroup.append("g")
        .selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("dy", "0.35em")
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("font_family", "sans-serif")  // Font type
        .attr("font-size", "11px")  // Font size
        .attr("fill", "white")  // Font color
        .attr("text-anchor", "middle")
        .attr("font-family", "Yanone Kaffeesatz")
        .attr("font-weight", 500);
 

    // // Step 6: Initialize tool tip
    // // ==============================
    // var toolTip = d3.tip()
    //   .attr("class", "d3-tip")
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`State: ${d.state}<br>In Poverty: ${d.poverty}%<br>Lack of Healthcare: ${d.healthcare}%`);
    //   });

    // // Step 7: Create tooltip in the chart
    // // ==============================
    // circlesGroup.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // circlesGroup.on("mouseover", function(data) {
    //     toolTip.show(data,this);
    // })
    // .on("mouseout", function(data, index) {
    //     toolTip.hide(data);
    //   });


    // Create axes labels

    var xText = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`);

    var povertyLabel = xText.append("text")
        .attr("y", 20)
        .attr("x", 0)
        .attr("value", "poverty")
        .attr("class","axesText ")
        .text("In Poverty (%)");
    
    console.log(`PRINT SOMETHING HERE`);  
    console.log(`povertyLabel: ${povertyLabel}`);
    
    var yText = chartGroup.append("g")
        .attr("transform", `translate(0, ${height / 2})`);

    var healthcareLabel = yText.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", 0)
        .attr("value", "healthcare")
        .attr("dy", "1em")
        .attr("class","axesText active")
        .text("Lack of Healthcare (%)");


}).catch(function(error) {
    console.log(error);
  });
