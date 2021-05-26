var express = require("express")
var bodyParser = require("body-parser")
var convertJsonToCsv = require("./utils/jsonToCsvHelpers")

var app = express()
var PORT = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + "/client"))

app.post("/jsonToCsv", (req, res) => {
  // YOUR CODE HERE
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
