import {io} from 'socket.io-client';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom'
import Space from './components/Space.jsx';
class App extends React.Component {
  constructor(props) {
    super(props);

    //bind methods here
    this.sendAttack = this.sendAttack.bind(this);
    this.sendBoard = this.sendBoard.bind(this);
    this.receiveBoard = this.receiveBoard.bind(this);
    this.receiveAttack = this.receiveAttack.bind(this);
    this.opponentHoverHandler = this.opponentHoverHandler.bind(this);
    this.opponentClickHandler = this.opponentClickHandler.bind(this);
    this.playerHoverHandler = this.playerHoverHandler.bind(this);
    this.playerClickHandler = this.playerClickHandler.bind(this);
    this.rotatePiece = this.rotatePiece.bind(this);
    this.openConnection = this.openConnection.bind(this);
    //

    //set reference tools here
    this.colorKeys = {
      0: '#d7d7d7',
      1: '#ffcccc',
      2: '#006699',
      3: '#009900',
      4: '#9900cc',
      5: '#996633',
      8: '#000000',
      9: '#ff0000'
    };
    this.oneOrTwo;
    this.username; //set in componentDidMount
    this.socket;
    //
    this.state = {
      //1 for attack highlight, only for display state purpose
      //2,3,4,5 represent ships
      //9 for hit, red marker
      //8 for miss, black marker

      //display state
      playerDisplay: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      opponentDisplay: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      //game state
      player: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      //game state
      opponent: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],

      placemode: true,
      currentlyPlacing: 2,
      placingDirection: 'horizontal',
      myTurn: false,
      waitingForOpponent: false,
      opponentShipsSunk: 'Opponent Ships sunk: ',
      winner: undefined,
      history: []
    };
  }

  componentDidMount() {
    this.username = prompt('Please choose a username');
    this.socket = io();
    this.socket.on('sending history', (history) => {
      this.setState({
        history: history
      });
    });
  }

  //call once ships are placed
  openConnection() {
    this.socket.emit('ready to start', this.username, this.state.player, (response) => {
      //console.log(response);
    });

    //will receive the username who gets the 1st turn
    this.socket.on('Game Ready', (playerToStart) => {
      if (this.oneOrTwo === playerToStart) {
        this.setState({
          myTurn: true,
          waitingForOpponent: false
        });
      } else {
        this.setState({
          waitingForOpponent: false
        });
      }
      console.log('player ' + playerToStart + ' goes first');
    });

    this.socket.on('players online', (data) => {
      console.log(data);
      if (data.slice(data.length - 22, data.length) === 'first player connected') {
        this.oneOrTwo = 1;
        this.setState({
          waitingForOpponent: true
        });
      }
      if (data.slice(data.length - 23, data.length) === 'second player connected') {
        this.oneOrTwo = this.oneOrTwo ? 1 : 2;
      }

    });

    this.socket.on('send attack to client', (row, column) => {
      this.receiveAttack(row, column);
      //receive attack calls sendBoard for us, this prevents async issues
    });

    this.socket.on('send new board to client', (board, sunkList) => {
      this.receiveBoard(board, sunkList);
    });
    this.socket.on('declare winner', (winner) => {
      this.setState({
        winner: winner
      });
    });
  }

  opponentHoverHandler(row, column) {
    if (this.state.winner) {
      return;
    }
    if (!this.state.myTurn) {
      //wait your turn
      return;
    }
    if (this.state.opponent[row][column] !== 0) {
      //no need to highlight if space already occupied
      return;
    }
    var newDisplay = JSON.parse(JSON.stringify(this.state.opponent));
    newDisplay[row][column] = 1;
    this.setState({
      opponentDisplay: newDisplay
    });
  }

  opponentClickHandler(row, column) {
    if (this.state.winner) {
      return;
    }
    if(!this.state.myTurn) {
      //wait your turn
      return;
    }
    if (this.state.opponent[row][column] !== 0) {
      return; //you've already attacked that space
    }
    this.sendAttack(row, column);
  }

  receiveAttack(row, column) {
    console.log('received attack on ' + row + ' ' + column);
    var newPlayerState = JSON.parse(JSON.stringify(this.state.player));
    if (this.state.player[row][column] >= 2 && this.state.player[row][column] <= 5) {
      newPlayerState[row][column] = 9;
    } else {
      newPlayerState[row][column] = 8;
    }
    this.setState({
      player: newPlayerState,
      playerDisplay: newPlayerState
    }, this.sendBoard);
  }

  sendBoard() {
    console.log('new player board sent to server');
    this.socket.emit('send new board to server', this.oneOrTwo, this.username, this.state.player, (response) => {
      this.setState({
        myTurn: true
      });
    });
  }

  sendAttack(row, column) {
    this.socket.emit('send attack to server', this.oneOrTwo, row, column, (response) => {
      console.log('attack sent to ' + row + ' ' + column);
      this.setState({
        myTurn: false
      });
    });
  }

  receiveBoard(board, sunkList) {
    var newSunkMessage = 'Opponent Ships Sunk: ' + sunkList.join(' ');
    console.log('received new board from opponent');
    this.setState({
      opponent: board,
      opponentDisplay: board,
      opponentShipsSunk: newSunkMessage
    });
  }

  playerHoverHandler(row, column) {
    //hovering over player board should not do anything unless we are placing ships
    if (!this.state.placemode) {
      return;
    }
    var newDisplay;
    if (this.state.placingDirection === 'horizontal') {
      if (column > 10 - this.state.currentlyPlacing) {
        //invalid placement, do nothing
        return;
      }
      for (var i = column; i < (column + this.state.currentlyPlacing); i++) {
        if (this.state.player[row][i] !== 0)
        {
          //somethings already there
          return;
        }
      }
      newDisplay = JSON.parse(JSON.stringify(this.state.player));
      for (var i = column; i < (column + this.state.currentlyPlacing); i++) {
        newDisplay[row][i] = this.state.currentlyPlacing;
      }
    }
    if(this.state.placingDirection === 'vertical') {
      if (row > 10 - this.state.currentlyPlacing) {
        return;
      }
      for (var i = row; i < (row + this.state.currentlyPlacing); i++) {
        if (this.state.player[i][column] !== 0) {
          //somethings already there
          return;
        }
      }
      newDisplay = JSON.parse(JSON.stringify(this.state.player));
      for (var i = row; i < (row + this.state.currentlyPlacing); i++) {
        newDisplay[i][column] = this.state.currentlyPlacing;
      }
    }
    this.setState({
      playerDisplay: newDisplay
    });
  }

  playerClickHandler(row, column) {
    if (!this.state.placemode) {
      return;
    }
    var copyDisplayToGameState = JSON.parse(JSON.stringify(this.state.playerDisplay));
    var stillPlacing = this.state.currentlyPlacing < 5;
    if (!stillPlacing) {
      this.openConnection();
    }
    this.setState({
      player: copyDisplayToGameState,
      currentlyPlacing: this.state.currentlyPlacing + 1,
      placemode: stillPlacing
    });
    //if finished placing, lets tell the server to find us a partner
  }

  rotatePiece() {
    this.setState({
      placingDirection: this.state.placingDirection === 'horizontal' ? 'vertical' : 'horizontal'
    });
  }

  render() {
    var elements = [];
    for (var row = 0; row < this.state.opponent.length; row++) {
      for (var column = 0; column < this.state.opponent[0].length; column++) {
        var colorKeyPlayer = this.state.playerDisplay[row][column];
        var colorPlayer = this.colorKeys[colorKeyPlayer];
        var colorKeyOpponent = this.state.opponentDisplay[row][column];
        var colorOpponent = this.colorKeys[colorKeyOpponent];
        elements.push(<Space row={row} column={column} player={'player'} colorKey={colorKeyPlayer} color={colorPlayer} playerHoverHandler={this.playerHoverHandler} playerClickHandler={this.playerClickHandler}/>);
        elements.push(<Space row={row} column={column} player={'opponent'} colorKey={colorKeyOpponent} color={colorOpponent} opponentHoverHandler={this.opponentHoverHandler} opponentClickHandler={this.opponentClickHandler}/>);
      }
    }
    if (this.state.placemode) {
      elements.push(<button id={'rotate'} onClick={this.rotatePiece}>Rotate Piece</button>)
    }

    var turnMessage = this.state.myTurn ? 'Its your turn!' : 'Opponents Turn';
    if (this.state.waitingForOpponent) {
      turnMessage = 'Waiting for opponent to place ships';
    }
    if (this.state.winner) {
      turnMessage = 'Congrats to ' + this.state.winner + '!';
    }

    var historyElements = [];
    for (var y = 0; y < this.state.history.length; y++) {
      historyElements.push(<p>{this.state.history[y]}</p>);
    }

    return (
    <div>
      <div>
        {elements}
      </div>
      <div id="welcome">
        <h2>Welcome to Battleship</h2>
        {this.state.placemode &&
        <p>The game will start once both <br /> players have placed their ships. <br />Place your ships on the lower<br />grid. Attack your opponent on the <br /> upper grid.</p>
        }
        {!this.state.placemode &&
        <h3>{turnMessage}</h3>
        }
        <h4>{this.state.opponentShipsSunk}</h4>
      </div>
      <div id="scoreboard">
        <h2>Game History</h2>
        <div>
          {historyElements}
        </div>
      </div>

    </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));