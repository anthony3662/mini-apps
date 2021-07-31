const mongoose = require('./database/index.js');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.use(express.json());

var playerOnes = [];
var playerTwos = [];
var nextPairId = 0;

var boardFilter = function(board) {
  for (var row = 0; row < board.length; row++) {
    for (var col = 0; col < board[0].length; col++) {
      if (board[row][col] >= 2 && board[row][col] <= 5) {
        board[row][col] = 0;
      }
    }
  }
  return board;
};

var shipsSunk = function(board) {
  var results = [];
  var searchBoard = function(q) {
    for (var row = 0; row < board.length; row++) {
      for (var column = 0; column < board[0].length; column++) {
        if (board[row][column] === q) {
          return true;
        }
      }
    }
    return false;
  };

  if (!searchBoard(2)) {
    results.push('Destroyer');
  }
  if (!searchBoard(3)) {
    results.push('Submarine');
  }
  if (!searchBoard(4)) {
    results.push('Battleship');
  }
  if (!searchBoard(5)) {
    results.push('Carrier');
  }
  return results;
};

io.on('connection', (socket) => {

  var sendHistory = function() {
    var history = [];
    mongoose.find()
    .then((records) => {
      history = records.map(function(record) {
        return record.text;
      });
      io.emit('sending history', history);
    })
    .catch((err) => {
      console.log('darn');
    });
  };

  console.log('A user connected');
  sendHistory();


  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('ready to start', (user, board, cb) => {
    socket.username = user;
    socket.join('' + nextPairId);
    if (!playerOnes[nextPairId]) {
      playerOnes[nextPairId] = socket;
      cb();
      io.emit('players online', `Pair #${nextPairId} first player connected`);
    } else {
      playerTwos[nextPairId] = socket;
      cb();
      io.emit('players online', `Pair #${nextPairId} second player connected`);
      let playerToStart = Math.random() < 0.5 ? 1 : 2;
      io.to('' + nextPairId).emit('Game Ready', playerToStart);
      nextPairId += 1;
    }
  });

  socket.on('send attack to server', (oneOrTwo, row, column, cb) =>{
    cb();
    let pairId = Array.from(socket.rooms).sort((a, b) => a.length - b.length)[0];
    let pairIdInt = parseInt(pairId);
    console.log('Pair Id ' + pairId + ' Attack from player ' + oneOrTwo + ' ' + row + ' ' + column);
    socket.broadcast.to(pairId).emit('send attack to client', row, column);
  });

  socket.on('send new board to server', (oneOrTwo, user, board, cb) => {
    cb();
    let sunkList = shipsSunk(board);
    board = boardFilter(board);
    let pairId = Array.from(socket.rooms).sort((a, b) => a.length - b.length)[0];
    let pairIdInt = parseInt(pairId);
    console.log(`Pair #${pairId} Received updated board from player ${oneOrTwo}`);
    console.log(typeof oneOrTwo);
    let intendedTargetSocket = oneOrTwo === 1 ? playerTwos[pairIdInt] : playerOnes[pairIdInt];
    socket.broadcast.to(pairId).emit('send new board to client', board, sunkList);
    if (sunkList.length === 4) {
      var winner = intendedTargetSocket.username;
      var loser = user;
      var time = new Date();
      var stamp = time.toLocaleString();
      var text = winner + ' beat ' + loser + '! ' + stamp;
      var newRecord = {
        text: text,
        winner: winner,
        time: time
      };
      mongoose.save(newRecord)
      .then(() => {
        io.to(pairId).emit('declare winner', intendedTargetSocket.username);
        sendHistory();
      })
      .catch((err) => {
        console.log('oops');
      });
    }
  });



});




http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});