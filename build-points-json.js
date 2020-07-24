// to be run in node
var lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("points.txt"),
})

let result = []
lineReader.on("line", function (line) {
  let extracted_values = line.split("     ")
  result.push({
    name: extracted_values[1].split(".")[0],
    chord: extracted_values[1].split("_")[0],
    values: JSON.parse(extracted_values[0].slice(1, -1).split(" ").join(",")),
    dynamic: extracted_values[1].split("_")[1],
    iteration: extracted_values[1].split("_")[2].replace(".wav", ""),
  })
}).on("close", function(){
    console.log(JSON.stringify(result, null, 4))
})
