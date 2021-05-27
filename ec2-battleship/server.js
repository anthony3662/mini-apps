const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

var player1 = undefined;
var player2 = undefined;

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

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    player1 = undefined;
    player2 = undefined;
  });

  socket.on('ready to start', (user, board, cb) => {
    if (!player1) {
      player1 = user;
      cb();
      io.emit('players online', 'first player connected');
    } else if (!player2) {
      player2 = user;
      cb();
      io.emit('players online', 'second player connected');
    } else {
      cb();
      io.emit('players online', 'Server can only handle 2 players right now');

    }
    if (player2) {
      var userToStart = Math.random() < 0.5 ? player1 : player2;
      io.emit('Game Ready', userToStart);
    }
  });

  socket.on('send attack to server', (user, row, column, cb) =>{
    console.log('Attack from ' + user + ' ' + row + ' ' + column);
    cb();
    var intendedTarget = user === player1 ? player2 : player1;
    io.emit('send attack to client', intendedTarget, row, column);
  });

  socket.on('send new board to server', (user, board, cb) => {
    console.log('Received updated board from ' + user);
    cb();
    board = boardFilter(board);
    var intendedTarget = user === player1 ? player2 : player1;
    io.emit('send new board to client', intendedTarget, board);
  });
});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});