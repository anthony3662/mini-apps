const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

var red = 0;
var yellow = 0;
var tie = 0;
var history = [];
app.get('/scores', (req, res) => {
  var mail = {
    scoreboard: `Scoreboard: Red: ${red} Yellow: ${yellow} Tie: ${tie}`,
    history: history
  };
  res.json(mail);
});

app.post('/scores', (req, res) => {
  var winner = req.body.winner;
  if (winner ==='red') {
    red += 1;
    history.unshift('Red Wins!');
  } else if (winner === 'yellow') {
    yellow += 1;
    history.unshift('Yellow Wins!');
  } else if (winner === 'tie') {
    tie += 1;
    history.unshift('TIE');
  } else {
    res.sendStatus(500);
  }
  res.sendStatus(201);
});

app.delete('/scores', (req, res) => {
  red = 0;
  yellow = 0;
  tie = 0;
  history = [];
  res.sendStatus(201);
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
