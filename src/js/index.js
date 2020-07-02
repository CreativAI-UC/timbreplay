import * as d3 from "d3"
import "../index.html"
import "../css/main.css"
import Data from "../data/iris.csv"
import "./interactions.js"
import "../assets/grip-lines-1white.svg"
import "normalize.css"
import "./constants.js"
import "core-js-bundle"
import "regenerator-runtime/runtime"

// import "regenerator-runtime/runtime"
import  {addPoint, toggleRec} from "./recording"
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

const x = d3.scaleLinear().domain([-20, 40]).range([0, width])
const y = d3.scaleLinear().domain([-50, 20]).range([height, 0])
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

//Read the data
d3.csv(Data).then((data) => {
  // Color scale: give me a specie name, I return a color
  const color = d3
    .scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica"])
    .range(["#440154ff", "#21908dff", "#fde725ff"])

  // Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.Sepal_Length)
    })
    .attr("cy", function (d) {
      return y(d.Petal_Length)
    })
    .attr("r", 5)
    .style("fill", function (d) {
      return color(d.Species)
    })
})

d3.select("#dataviz").on("click",addPoint(d3,svg,x,y))
document.getElementById("record-button").addEventListener("click",toggleRec)