const MONGO_USER = 'Heroku';
const PASSWORD = '0hZkC0OutmdJxv8r';
const CLUSTER = 'fullstack-review';
const uri = `mongodb+srv://Heroku:${PASSWORD}@fullstack-review.maljn.mongodb.net/connectfour?retryWrites=true&w=majority`;

const mongoose = require('mongoose');
mongoose.connect(uri);

const recordSchema = mongoose.Schema({
  text: String,
  winner: String,
  time: Number
});

let Record = mongoose.model('Record', recordSchema);

let save = (record) => {
  var newRecord = new Record(record);
  return newRecord.save();
};

let count = function(winner) {
  return Record.count({
    winner: winner
  });
};

let find = function() {
  return Record.find().sort({
    time: 'desc'
  }).limit(15);
};

let clear = function() {
  return Record.remove({});
};

module.exports.save = save;
module.exports.count = count;
module.exports.find = find;
module.exports.clear = clear;