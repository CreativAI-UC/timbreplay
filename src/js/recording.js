export let RECORDING = false
let CHORD_COUNT = 1
const DOMAIN = "http://127.0.0.1:8000"

async function fetchAudio(x, y) {
  const requestOptions = {
    headers: {
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin":"*"
    },
    method: "GET",
  }
  let esc = encodeURIComponent
  return fetch(
    DOMAIN + "/generate?x=" + esc(x) + "&y=" + esc(y),
    requestOptions
  ).then((res) => {
    if (!res.ok) throw new Error(`${res.status} = ${res.statusText}`) // response.body is a readable stream.
    // Calling getReader() gives us exclusive access to
    // the stream's content      
    const reader = res.body.getReader();
    // read() returns a promise that resolves
    // when a value has been received      
    return reader.read().then((result) => {
      return result
    })
  })
}

export function addPoint(d3, svg,scaleX,scaleY) {
  return function () {
    if (RECORDING) {
      const mouse = d3.mouse(this)
      const clickedX = scaleX.invert( mouse[0])
      const clickedY = scaleY.invert(mouse[1])

      svg
        .append("circle")
        .attr("cx", mouse[0])
        .attr("cy", mouse[1])
        .attr("r", 15)
        .attr("fill", "#de8a0d")

      fetchAudio(clickedX, clickedY).then((response) => {
        // response.value for fetch streams is a Uint8Array
        var blob = new Blob([response.value], { type: "audio/wav" })
        var url = window.URL.createObjectURL(blob)
        window.audio = new Audio()
        window.audio.src = url
        window.audio.play()
      })

      const box = document.querySelector("#box-record")
      const template = document.querySelector("#chord-template")

      // Clone the new row and insert it into the table
      const clone = template.content.cloneNode(true)
      const row = clone.querySelector("p.chord-name")
      row.innerHTML = `Note ${CHORD_COUNT}`
      box.appendChild(clone)
      CHORD_COUNT += 1
    }
  }
}

export function toggleRec() {
  RECORDING = !RECORDING

  const content_boxes = document.querySelectorAll("div#box-content > div")

  content_boxes.forEach((elem) => elem.classList.add("hide"))
  content_boxes[3].classList.remove("hide")

  const recording_label = document.querySelector("#recording-label")

  if (!RECORDING) {
    recording_label.classList.add("hide")
  } else {
    recording_label.classList.remove("hide")
  }
}