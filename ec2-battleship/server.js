const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

var player1 = undefined;
var player2 = undefined;

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('ready to start', (user, board, cb) => {
    if (!player1) {
      player1 = user;
      cb('first player connected');
    } else if (!player2) {
      player2 = user;
      cb('second player connected');
    } else {
      cb('Server can only handle 2 players right now');
    }
    if (player2) {
      var userToStart = Math.random() < 0.5 ? player1 : player2;
      socket.emit('Game Ready', userToStart);
    }
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});