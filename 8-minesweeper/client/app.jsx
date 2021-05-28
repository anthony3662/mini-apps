import React from 'react';
import ReactDOM from 'react-dom';
import Space from './components/Space.jsx';
class App extends React.Component {
  constructor(props) {
    super(props);

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
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]
    };
  }

  rightClickHandler(row, column) {
    console.log('asf');
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
    var memoboard = JSON.parse(JSON.stringify(this.state.board));
    this.clickHandlerZero(row, column, memoboard);
    this.setState({
      board: memoboard
    });
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
    return (
      <div>
        {spaces}
      </div>
    );
  }
}

ReactDOM.render(<App /> , document.getElementById('app'));

