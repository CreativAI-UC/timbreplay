import data from "../../assets/points.json"
import * as d3 from "d3"
import { colormap } from "../constants"
import { addPoint, toggleRec } from "../recording"
import { mouseleave, mouseenter } from "../interactions"
const width = window.innerWidth
const height = window.innerHeight

// append the svg object to the body of the page
var svg = d3
  .select("#dataviz")
  .append("div")
  // Container class to make it responsive.
  .classed("svg-container", true)
  .style("padding-bottom", String((height / width) * 100) + "%")
  .append("svg")
  // Responsive SVG needs these 2 attributes and no width and height attr.
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + width + " " + height)
  // Class to make it responsive.
  .classed("svg-content-responsive", true)
  .append("g")

const x = d3.scaleLinear().domain([-20, 41]).range([0, width])
const y = d3.scaleLinear().domain([-53, 20]).range([height, 0])
const xAxis = d3.axisBottom(x)
const yAxis = d3.axisLeft(y)
const xAxisGrid = d3.axisBottom(x).tickSize(-height).tickFormat("").ticks(16)
const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat("").ticks(9)

// Create grids.
svg
  .append("g")
  .attr("class", "x axis-grid")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxisGrid)

svg.append("g").attr("class", "y axis-grid").call(yAxisGrid)

// Create axes.
svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
svg.append("g").attr("class", "y axis").call(yAxis)

// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
// Its opacity is set to 0: we don't see it by default.
const tooltip = d3
  .select("#dataviz")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")

// Add dots.
svg
  .append("g")
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", function (d) {
    return d.chord
  })
  .attr("cx", function (d) {
    return x(d.values[0])
  })
  .attr("cy", function (d) {
    return y(d.values[1])
  })
  .attr("r", function (d) {
    if (d.dynamic == "p") {
      return 4
    } else if (d.dynamic == "m") {
      return 7
    } else {
      return 10
    }
  })
  .style("fill", function (d) {
    return colormap[d.chord]
  })
  .on("mouseenter", mouseenter(tooltip, d3, width))
  .on("mouseleave", mouseleave(tooltip))

d3.select("#dataviz").on("click", addPoint(d3, svg, x, y))
document.getElementById("record-button").addEventListener("click", toggleRec)
