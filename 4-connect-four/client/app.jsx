import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Space from './components/Space.jsx'
import GhostSpace from './components/GhostSpace.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addPiece = this.addPiece.bind(this);
    this.checkWin = this.checkWin.bind(this);
    this.reset = this.reset.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.sendResultAndUpdate = this.sendResultAndUpdate.bind(this);
    this.clear = this.clear.bind(this);
    this.colorKeys = {
      0: 'gray',
      1: 'red',
      2: 'gold'
    };
    this.indexKeys = {
      'gray': 0,
      'red': 1,
      'gold': 2
    };
    this.state = {
      board: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
      ],
      //red is 1, yellow is 2
      turn: 'red',
      turnCount: 0,
      gameOver: false,
      scoreboard: 'Scoreboard: Red 0 Yellow 0 Tie 0',
      history: []
    };
  }

  componentDidMount() {
    this.getHistory();
  }

  clear() {
    return axios.delete('http://localhost:3000/scores')
      .then(() => {
        return this.getHistory();
      })
      .catch((err) => {
        console.log('cry');
      });
  }

  getHistory() {
    return axios.get('http://localhost:3000/scores')
      .then((response) => {
        var newHistory = response.data.history.slice();
        this.setState({
          scoreboard: response.data.scoreboard,
          history: newHistory
        });
      })
      .catch((err) => {
        console.log('oops');
        this.setState({
          scoreboard: 'Scoreboard: No server connection'
        });
      });
  }

  sendResultAndUpdate(colorString) {
    return axios.post('http://localhost:3000/scores', {
      winner: colorString,
      time: new Date().getTime()
    })
      .then(() => {
        return this.getHistory();
      })
      .then(() => {
        this.setState({
          gameOver: true
        });
        alert(colorString + ' wins!')
      })
      //need to make sure game still works offline!
      .catch((err) => {
        console.log('darn');
        alert(colorString + ' wins!')
        this.setState({
          gameOver: true
        });
      })
  }

  reset() {
    this.setState({
      board: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
        ],
        //red is 1, yellow is 2
        turn: 'red',
        turnCount: 0,
        gameOver: false
    });
  }

  addPiece(column) { //color string
    if (this.state.gameOver) {
      return;
    }
    var rowToPlace = -1;
    for (var row = 5; row >= 0; row--) {
      if (this.state.board[row][column] === 0) {
        rowToPlace = row;
        break;
      }
    }
    if (rowToPlace >= 0) {
      var deepCopy = JSON.parse(JSON.stringify(this.state.board));
      var newTurn = this.state.turn === 'red' ? 'gold' : 'red';
      deepCopy[rowToPlace][column] = this.indexKeys[this.state.turn];

      var cb = function() {
        this.checkWin(rowToPlace, column, deepCopy[rowToPlace][column]);
      };
      cb = cb.bind(this);
      this.setState({
        board: deepCopy,
        turn: newTurn,
        turnCount: this.state.turnCount + 1
      }, cb);
    }
  }

  //if we pass in some information, we won't have to check the whole grid
  checkWin(row, column, colorIndex) {

    var colArr = [];
    for (var z = row - 3; z <= row + 3; z++) {
      if (this.state.board[z] !== undefined) {
        colArr.push(this.state.board[z][column]);
      }
    }
    var rowArr = [];
    for (var z = column - 3; z <= column + 3; z++) {
      rowArr.push(this.state.board[row][z]);
    }
    var dOneArr = [];
    for (var z = -3; z <=3; z++) {
      if (this.state.board[row + z] !== undefined) {
        dOneArr.push(this.state.board[row + z][column + z])
      }
    }
    var dTwoArr = [];
    for (var z = -3; z <=3; z++) {
      if (this.state.board[row - z] !== undefined) {
        dTwoArr.push(this.state.board[row - z][column + z])
      }
    }
    var string1 = colArr.join('');
    var string2 = rowArr.join('');
    var string3 = dOneArr.join('');
    var string4 = dTwoArr.join('');

    if (string1.indexOf('1111') >= 0 ||
      string2.indexOf('1111') >= 0 ||
      string3.indexOf('1111') >= 0 ||
      string4.indexOf('1111') >= 0
    ) {
      this.sendResultAndUpdate('red');
      return;
    }
    if (string1.indexOf('2222') >= 0 ||
      string2.indexOf('2222') >= 0 ||
      string3.indexOf('2222') >= 0 ||
      string4.indexOf('2222') >= 0
    ) {
      this.sendResultAndUpdate('yellow');
      return;
    }

    if(this.state.turnCount === 42) {
      this.sendResultAndUpdate('tie');
    }
  }



  render() {
    var spaces = [];
    for (var column = 0; column < this.state.board[0].length; column++) {
      spaces.push(<GhostSpace column={column} color={this.state.turn} addPiece={this.addPiece}/>);
    }
    for (var row = 0; row < this.state.board.length; row++) {
      for (var column = 0; column < this.state.board[row].length; column++) {
        var colorIndex = this.state.board[row][column];
        var colorName = this.colorKeys[colorIndex];
        spaces.push(<Space row={row} column={column} color={colorName}/>);
      }
    }

    var histories = [];
    for(var y = 0; y < this.state.history.length; y++) {
      histories.push(<p>{this.state.history[y]}</p>);
    }

    return (
      <div>
        <div>
          {spaces}
        </div>

        <div  id="welcome">
          <h2>Welcome To Connect Four</h2>
          <div>
            <button onClick={this.reset}>New Game</button>
            <button onClick={this.clear}>Clear Scores</button>
          </div>
          <h4>{this.state.scoreboard}</h4>
          <div>
            {histories}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
