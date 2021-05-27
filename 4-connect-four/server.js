const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('./database/index.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));


app.get('/scores', (req, res) => {
  var red = 0;
  var yellow = 0;
  var tie = 0;
  var history = [];

  mongoose.count('red')
  .then((count) => {
    red = count;
    return mongoose.count('yellow');
  })
  .then((count) => {
    yellow = count;
    return mongoose.count('tie');
  })
  .then((count) => {
    tie = count;
    return mongoose.find();
  })
  .then((records) => {
    history = records.map(function(record) {
      return record.text;
    });
  })
  .then(() => {
    var mail = {
      scoreboard: `Scoreboard: Red: ${red} Yellow: ${yellow} Tie: ${tie}`,
      history: history
    };
    res.json(mail);
  })
  .catch((err) => {
    console.log('why oh why');
    res.sendStatus(500);
  });

});

app.post('/scores', (req, res) => {
  var winner = req.body.winner;
  var stamp = new Date(req.body.time).toLocaleString();
  var text = winner + ' wins! ' + stamp;
  var newRecord = {
    text: text,
    winner: req.body.winner,
    time: req.body.time
  };
  mongoose.save(newRecord)
  .then(() => {
    res.sendStatus(201);
  })
  .catch((err) => {
    console.log('what in the world');
    res.sendStatus(500);
  });
});

app.delete('/scores', (req, res) => {
  mongoose.clear()
  .then(() => {
    res.sendStatus(201);
  })
  .catch(() => {
    console.log('jejejeje');
    res.sendStatus(500);
  });
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
