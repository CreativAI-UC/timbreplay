// dragging for generated chords on the control box
// document level mouse handlers for dragging

let draggingEle
let x = 0
let y = 0
let placeholder
let isDraggingStarted = false

const mouseMoveHandler = function (e) {
  const draggingRect = draggingEle.getBoundingClientRect()

  if (!isDraggingStarted) {
    // Update the flag
    isDraggingStarted = true

    // Let the placeholder take the height of dragging element
    // So the next element won't move up
    placeholder = document.createElement("div")
    placeholder.classList.add("placeholder")
    draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling)

    // Set the placeholder's height
    placeholder.style.height = `${draggingRect.height}px`
  }

  const container = document.getElementById("control-box")

  // Set position for dragging element
  draggingEle.style.position = "absolute"
  draggingEle.style.top = `${e.pageY - y - container.offsetTop}px`
  draggingEle.style.left = `${e.pageX - x - container.offsetLeft}px`

  // The current order:
  // prevEle
  // draggingEle
  // placeholder
  // nextEle
  const prevEle = draggingEle.previousElementSibling
  const nextEle = placeholder.nextElementSibling

  // User moves item to the top
  if (prevEle && isAbove(draggingEle, prevEle)) {
    // The current order    -> The new order
    // prevEle              -> placeholder
    // draggingEle          -> draggingEle
    // placeholder          -> prevEle
    swap(placeholder, draggingEle)
    swap(placeholder, prevEle)
    return
  }
  // User moves the dragging element to the bottom
  if (nextEle && isAbove(nextEle, draggingEle)) {
    // The current order    -> The new order
    // draggingEle          -> nextEle
    // placeholder          -> placeholder
    // nextEle              -> draggingEle
    swap(nextEle, placeholder)
    swap(nextEle, draggingEle)
  }
}

const mouseUpHandler = function () {
  // Remove the placeholder
  placeholder && placeholder.parentNode.removeChild(placeholder)
  // Reset the flag
  isDraggingStarted = false

  console.log("mouseUp fired")
  // Remove the position styles
  draggingEle.style.removeProperty("top")
  draggingEle.style.removeProperty("left")
  draggingEle.style.removeProperty("position")

  x = null
  y = null
  draggingEle = null
  // Remove the handlers of `mousemove` and `mouseup`
  document.removeEventListener("mousemove", mouseMoveHandler)
  document.removeEventListener("mouseup", mouseUpHandler)
}

export const mouseDownHandler = function (id) {
  return (e) => {
    draggingEle = document.getElementById(id)

    // Calculate the mouse position
    const rect = draggingEle.getBoundingClientRect()
    x = e.pageX - rect.left
    y = e.pageY - rect.top

    // Attach the listeners to `document`
    document.addEventListener("mousemove", mouseMoveHandler)
    document.addEventListener("mouseup", mouseUpHandler)
  }
}

const isAbove = function (nodeA, nodeB) {
  // Get the bounding rectangle of nodes
  const rectA = nodeA.getBoundingClientRect()
  const rectB = nodeB.getBoundingClientRect()

  return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2
}

const swap = function (nodeA, nodeB) {
  const parentA = nodeA.parentNode
  const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling

  // Move `nodeA` to before the `nodeB`
  nodeB.parentNode.insertBefore(nodeA, nodeB)

  // Move `nodeB` to before the sibling of `nodeA`
  parentA.insertBefore(nodeB, siblingA)
}

function customPreventDefault(event) {
  event.preventDefault()
}

window.customPreventDefault = customPreventDefault
