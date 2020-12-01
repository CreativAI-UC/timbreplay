import { chords } from "../constants"
import * as d3 from "d3"
import { colormap } from "../constants"

// Insert legends.

const container = document.getElementById("box-legend")

chords.map((chordName) => {
  const item = document.createElement("div")
  item.id = "legend-" + chordName
  container.appendChild(item)

  d3.select("#legend-" + chordName)
    .append("svg")
    .attr("width", 30)
    .attr("height", 92)
    .append("rect")
    .attr("x", 0)
    .attr("y", 31)
    .attr("width", 30)
    .attr("height", 30)
    .attr("fill", colormap[chordName])
  d3.select("#legend-" + chordName)
    .append("p")
    .text(chordName)
})
