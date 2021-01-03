import { toggleRec, RECORDING } from "./recording"
import { dynamic_names } from "./constants"
/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement
let timeoutPool=[]

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen()
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen()
  }
}

let fullscreenOn = false
document.getElementById("fullscreen-button").onclick = () => {
  if (fullscreenOn) {
    closeFullscreen()
    fullscreenOn = false
  } else {
    openFullscreen()
    fullscreenOn = true
  }
}

// Make control box top bar draggable
// https://www.w3schools.com/howto/howto_js_draggable.asp
// Make the DIV element draggable:
dragElement(document.getElementById("control-box"))

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0

  if (document.getElementById("drag-section")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById("drag-section").onmousedown = dragMouseDown
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown
  }

  function dragMouseDown(e) {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    e = e || window.event
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px"
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px"
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null
    document.onmousemove = null
  }
}


function SelectBox(elementidx) {
  const content_boxes = document.querySelectorAll("div#box-content > div")
  const box_buttons = document.querySelectorAll("div#button-container > button")

  content_boxes.forEach((elem) => elem.classList.add("hide"))
  box_buttons.forEach((elem) => elem.classList.remove("selected"))
  if (elementidx == 1) {
    box_buttons[0].classList.add("selected")
    if (!RECORDING) {
      content_boxes[0].classList.remove("hide")
    } else {
      content_boxes[2].classList.remove("hide")
    }
  }
  if (elementidx == 2) {
    content_boxes[1].classList.remove("hide")
    box_buttons[1].classList.add("selected")
  }
  // if (elementidx == 3) {
  //   box_buttons[2].classList.add("selected")
  //   content_boxes[2].classList.remove("hide")
  // }
}

function playSound(button) {
  const audio = button.querySelector("audio")
  audio.play()
}

function playAudioById(audioId) {
  const audio = document.getElementById(audioId)
  audio.play()
}

function playAll(){
  const audioRows=document.querySelectorAll('.recorded-chord audio')
  console.log(audioRows);
  let i = -1

  function playNoteSequence(){
    if (i>=audioRows.length-1) {
      return
    }
    if (i>=0){
      audioRows[i].removeEventListener('ended', playNoteSequence)
    }
    i++
    audioRows[i].play()
    audioRows[i].addEventListener("ended", playNoteSequence)
  }
  playNoteSequence()
}

// start or stop recording on crtl+R
document.onkeyup = function (e) {
  if (e.ctrlKey && e.which == 82) {
    toggleRec()
  }
}

// A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
export const mouseenter = (tooltip, d3, documentWidth) =>
  function (d) {
    timeoutPool.forEach((timeoutId)=>window.clearTimeout(timeoutId))
    tooltip.style("opacity", 1).style("z-index",2)
    tooltip
      .html(
        '<div style="height:auto;width:40px;z-index:2;" onclick=\'playAudioById("audio_' +
          d.name +
          '")\'> <svg xml:space="preserve" viewBox="0 0 100 100" y="0" x="0" xmlns="http://www.w3.org/2000/svg" id="圖層_1" version="1.1" width="128px" height="128px" xmlns:xlink="http://www.w3.org/1999/xlink" style="width:100%;height:100%;background-color:transparent;animation-play-state:paused"> <g class="ldl-scale" style="transform-origin:50% 50% 0px;transform:rotate(0deg) scale(0.8);animation-play-state:paused"> <path fill="#333" d="M78.158 51.843L25.842 82.048c-1.418.819-3.191-.205-3.191-1.843v-60.41c0-1.638 1.773-2.661 3.191-1.843l52.317 30.205c1.418.819 1.418 2.867-.001 3.686z" style="fill:rgba(121, 251, 100, 0.59);animation-play-state:paused"></path> </g><!-- generated by https://loading.io/ --> </svg></div>' +
          "<p>This is a " +
          d.chord +
          " " +
          dynamic_names[d.dynamic] +
          "</p>" +
          '<audio id="audio_' +
          d.name +
          '"preload="none"> <source src="https://storage.googleapis.com/timbreplay-chords/piano_' +
          d.name +
          '.mp3" type="audio/mp3">   Your browser does not support the <code>audio</code> element.</audio>'
      )
      .style(
        "left",
        (documentWidth - d3.mouse(this)[0] > 250
          ? String(d3.mouse(this)[0] + 10)
          : String(d3.mouse(this)[0] - 300)) + "px"
      ) // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", d3.mouse(this)[1] + "px")
  }
// // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
export const mouseleave = (tooltip) =>
  function () {
      const timeoutId = window.setTimeout(() => {
        console.log("timeout done")
        tooltip.transition().duration(200).style("opacity", 0)
        tooltip.style("z-index", -1)
      }, 4000)
      timeoutPool.push(timeoutId)
    //}
    
    
  }

// TODO: fix this, not working ptoperly on fullscreen toggle
function redrawSvg() {
  const svg = document.querySelector("#dataviz>div.svg-container>svg")

  svg.setAttribute(
    "viewBox",
    "0 0 " + window.innerWidth + " " + window.innerHeight
  )
  const body= document.querySelector("body")
  body.setAttribute("width", window.innerWidth)
  body.setAttribute("height", window.innerHeight)
}


window.SelectBox = SelectBox
window.playSound = playSound
window.playAudioById = playAudioById
window.playAll = playAll
window.onresize = redrawSvg

