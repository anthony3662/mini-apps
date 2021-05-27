import {io} from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom'
import Space from './components/Space.jsx';
class App extends React.Component {
  constructor(props) {
    super(props);

    //bind methods here
    this.playerHoverHandler = this.playerHoverHandler.bind(this);
    this.playerClickHandler = this.playerClickHandler.bind(this);
    this.rotatePiece = this.rotatePiece.bind(this);
    this.openConnection = this.openConnection.bind(this);
    //

    //set reference tools here
    this.colorKeys = {
      0: '#d7d7d7',
      2: '#006699',
      3: '#009900',
      4: '#9900cc',
      5: '#996633',
      8: '#000000',
      9: '#ff0000'
    };
    this.username;
    //
    this.state = {
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
      placingDirection: 'horizontal'
    };
  }

  componentDidMount() {
    this.username = prompt('Please choose a username');
  }

  //call once ships are placed
  openConnection() {
    this.socket = io();
    this.socket.emit('ready to start', this.username, this.state.player, (response) => {
      console.log(response);
    });

    //will receive the username who gets the 1st ture
    this.socket.on('Game Ready', (userToStart) => {
      console.log(userToStart);
    })
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
        var colorKeyOpponent = this.state.opponent[row][column];
        var colorOpponent = this.colorKeys[colorKeyOpponent];
        elements.push(<Space row={row} column={column} player={'player'} colorKey={colorKeyPlayer} color={colorPlayer} playerHoverHandler={this.playerHoverHandler} playerClickHandler={this.playerClickHandler}/>);
        elements.push(<Space row={row} column={column} player={'opponent'} colorKey={colorKeyOpponent} color={colorOpponent}/>);
      }
    }
    if (this.state.placemode) {
      elements.push(<button id={'rotate'} onClick={this.rotatePiece}>Rotate Piece</button>)
    }

    return(
      <div>
        {elements}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));