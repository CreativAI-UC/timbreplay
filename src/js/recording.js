export let RECORDING = false
let CHORD_COUNT=1

export function addPoint(d3, svg) {
  return function () {
    if (RECORDING) {
      const mouse = d3.mouse(this)

      svg
        .append("circle")
        .attr("cx", mouse[0])
        .attr("cy", mouse[1])
        .attr("r", 5)
        .attr("fill", "#039BE5")
        .attr("stroke", "#039BE5")
        .attr("stroke-width", "1px")


      const box = document.querySelector("#box-record")
      const template = document.querySelector("#chord-template")

      // Clone the new row and insert it into the table
      const clone = template.content.cloneNode(true)
      const row = clone.querySelector("p.chord-name")
      row.innerHTML = `Note ${CHORD_COUNT}`
      box.appendChild(clone)
      CHORD_COUNT+=1
    }
  }
}

export function toggleRec() {
  RECORDING = !RECORDING

  const content_boxes = document.querySelectorAll("div#box-content > div")

  content_boxes.forEach((elem) => elem.classList.add("hide"))
  content_boxes[3].classList.remove("hide")

  const recording_label = document.querySelector("#recording-label")

  if (!RECORDING){
    recording_label.classList.add("hide")
  }else{
    recording_label.classList.remove("hide")
  }
}

