const chords = [
  "C2",
  'Dm2',
  'Em2',
  'F2',
  'G2',
  'Am2',
  'Bdim2',
  'C3',
  'Dm3',
  'Em3',
  'F3',
  'G3',
  'Am3',
  'Bdim3',
  'C4'
]

const container =document.getElementById("box-legend")

chords.map(chordName=>{
    const item=document.createElement('div')
    const text = document.createElement("p")
    text.innerText=chordName
    
    item.appendChild(text)
    container.appendChild(item)
})