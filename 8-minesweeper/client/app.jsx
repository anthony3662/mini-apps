import React from 'react';
import ReactDOM from 'react-dom';
import Space from './components/Space.jsx';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.makeEmptyBoard = this.makeEmptyBoard.bind(this);
    this.checkBoard = this.checkBoard.bind(this);
    this.handleFirstClick = this.handleFirstClick.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.rightClickHandler = this.rightClickHandler.bind(this);
    this.clickHandlerZero = this.clickHandlerZero.bind(this);
    this.countSurroundingMines = this.countSurroundingMines.bind(this);
    this.hasMine = this.hasMine.bind(this);
    this.isUnclicked = this.isUnclicked.bind(this);
    this.getUnclickedNeighbors = this.getUnclickedNeighbors.bind(this);
    this.state = {
      //0-8 for uncovered safe spaces, 9 for covered, 10 for flagged, -1 for exposed mine
      board: [
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
      ],
      mines: [
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
      firstClick: true,
      mineCount: 10,
      gameOutcome: undefined

    };
  }


  //this starts a new game. keep in mind mine state is determined on the first click
  //so you can't lose immediately
  makeEmptyBoard(rowCount, columnCount, mineCount) {
    var newBoard = [];
    for (var i = 0; i < rowCount; i++) {
      var newRow = new Array(columnCount).fill(9);
      newBoard.push(newRow);
    }
    var newMines = JSON.parse(JSON.stringify(newBoard));
    this.setState({
      board: newBoard,
      mines: newMines,
      mineCount: mineCount,
      gameOutcome: undefined,
      firstClick: true
    });
  }

  checkBoard() {
    var clicksToWin = this.state.board.length * this.state.board[0].length - this.state.mineCount;
    var spacesCleared = 0;
    for (var row = 0; row < this.state.board.length; row++) {
      for (var column = 0; column < this.state.board[0].length; column++) {
        var spaceStatus = this.state.board[row][column];
        if (spaceStatus >= 0 && spaceStatus <= 8) {
          spacesCleared += 1;
        }
        if (spaceStatus === -1) {
          this.setState({
            gameOutcome: 'lose'
          });
          return;
        }
      }
    }
    if (spacesCleared === clicksToWin) {
      this.setState({
        gameOutcome: 'win'
      });
    }
  }

  rightClickHandler(row, column) {
    if (this.state.gameOutcome) {
      return;
    }
    if(this.state.board[row][column] !== 9 && this.state.board[row][column] !== 10) {
      return;
    }
    var newTile = 10;
    if (this.state.board[row][column] === 9) {
      newTile = 10;
    } else if (this.state.board[row][column] === 10) {
      newTile = 9;
    }
    var memoboard = JSON.parse(JSON.stringify(this.state.board));
    memoboard[row][column] = newTile;
    this.setState({
      board: memoboard
    });
  }

  clickHandler(row, column) {
    if (this.state.gameOutcome) {
      return;
    }
    if (this.state.firstClick) {
      this.handleFirstClick(row, column);
      return;
    }
    var memoboard = JSON.parse(JSON.stringify(this.state.board));
    this.clickHandlerZero(row, column, memoboard);
    this.setState({
      board: memoboard
    }, this.checkBoard);
  }

  //generate mines on first move to ensure you can't lose on first click
  handleFirstClick(row, column) {
    var boardRowCount = this.state.board.length;
    var numberOfSpaces = boardRowCount * this.state.board[0].length;
    var shuffler = []; //create array 0 - 99
    for (var i = 0; i < numberOfSpaces; i++) {
      shuffler.push(i);
    }
    //ensures the 1st click cannot get a mine
    var playerIndex = row * this.state.board[0].length + column;
    shuffler.splice(playerIndex, 1);

    //get an array of locations to place mines
    shuffler.sort(() => Math.random() - 0.5);
    var mineIndexes = shuffler.slice(0, this.state.mineCount)

    //place mines
    var memoMinefield = JSON.parse(JSON.stringify(this.state.mines));
    for (var i = 0; i < mineIndexes.length; i++) {
      var placeRow = Math.floor(mineIndexes[i] / this.state.board[0].length);
      var placeCol = mineIndexes[i] % this.state.board[0].length;
      memoMinefield[placeRow][placeCol] = 1;
    }

    //call clickHandler function after setting state
    var cb = function() {
      this.clickHandler(row, column);
    }.bind(this);

    this.setState({
      mines: memoMinefield,
      firstClick: false
    }, cb);

  }

  clickHandlerZero(row, column, memoboard) {
    if (memoboard[row][column] !== 9) {
      return;
    }
    var newTile = 0;
    if (this.state.mines[row][column] === 1) {
      newTile = -1;
    } else {
      newTile = this.countSurroundingMines(row, column);
    }
    memoboard[row][column] = newTile;
    if (newTile === 0) {
      var unclickedNeighbors = this.getUnclickedNeighbors(row, column, memoboard);
      for (var i = 0; i < unclickedNeighbors.length; i++) {
        this.clickHandlerZero(unclickedNeighbors[i][0], unclickedNeighbors[i][1], memoboard);
      }
    }

  }


  getUnclickedNeighbors(row, column, board) {
    var tuples = [];
    if (this.isUnclicked(row - 1, column - 1, board))
      tuples.push([row - 1, column - 1]);
    if (this.isUnclicked(row - 1, column, board))
      tuples.push([row - 1, column ]);
    if (this.isUnclicked(row - 1, column + 1, board))
      tuples.push([row - 1, column + 1]);
    if (this.isUnclicked(row, column - 1, board))
      tuples.push([row, column - 1]);
    if (this.isUnclicked(row, column + 1, board))
      tuples.push([row, column + 1]);
    if (this.isUnclicked(row + 1, column - 1, board))
      tuples.push([row + 1, column - 1]);
    if (this.isUnclicked(row + 1, column, board))
      tuples.push([row + 1, column]);
    if (this.isUnclicked(row + 1, column + 1, board))
      tuples.push([row + 1, column + 1]);
    return tuples;
  }

  countSurroundingMines(row, column) {
    var count = 0;
    if (this.hasMine(row - 1, column - 1))
      count ++;
    if (this.hasMine(row - 1, column))
      count ++;
    if (this.hasMine(row - 1, column + 1))
      count ++;
    if (this.hasMine(row, column - 1))
      count ++;
    if (this.hasMine(row, column + 1))
      count ++;
    if (this.hasMine(row + 1, column - 1))
      count ++;
    if (this.hasMine(row + 1, column))
      count ++;
    if (this.hasMine(row + 1, column + 1))
      count ++;
    return count;
  }

  isUnclicked(row, column, board) {
    if (row < 0 || row >= board.length) {
      return false;
    }
    if (board[row][column] === 9) {
      return true;
    }
    return false;
  }

  hasMine(row, column) {
    if (row < 0 || row >= this.state.mines.length) {
      return false;
    }
    if (this.state.mines[row][column] === 1) {
      return true;
    }
    return false;
  }

  render() {
    var spaces = [];
    for (var row = 0; row < this.state.board.length; row++) {
      for (var column = 0; column < this.state.board[0].length; column++) {
        spaces.push(<Space row={row} column={column} number={this.state.board[row][column]} clickHandler={this.clickHandler} rightClick={this.rightClickHandler}/>);
      }
    }
    var winMessage;
    if(this.state.gameOutcome === 'win') {
      winMessage = <h1>NICE!</h1>;
    } else if (this.state.gameOutcome === 'lose') {
      winMessage = <h1>BOOM BOOM GAME OVER</h1>;
    }
    return (
      <div>
        <div>
          {spaces}
        </div>
        <div id={'welcome'}>
          <h2>Minesweeper</h2>
          <p>Click to Dig, Right Click to Flag</p>
          <p>Clear all safe spaces to win!</p>
          <div>
            <h3>New Game</h3>
            <button onClick={() =>{this.makeEmptyBoard(10, 10, 10)}}>Easy</button>
            <button onClick={() =>{this.makeEmptyBoard(12, 15, 24)}}>Medium</button>
            <button onClick={() =>{this.makeEmptyBoard(15, 20, 60)}}>Hard</button>
          </div>
          <div>
            {winMessage}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App /> , document.getElementById('app'));

