const express = require("express");
const mongoose = require('./database/index.js');

const transactions = require('./database/transaction.js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.get('/transactions', (req, res) => {
  transactions.getAll()
  .then((results) => {
    res.status(200).json(results);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.post('/transactions', (req, res) => {
  var newTrans = req.body;
  transactions.create(newTrans)
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});



app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
