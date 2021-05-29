import React from 'react';
class Space extends React.Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
    this.rightClick = this.rightClick.bind(this);
  }

  click() {
    this.props.clickHandler(this.props.row, this.props.column);
  }

  rightClick(e) {
    e.preventDefault();
    this.props.rightClick(this.props.row, this.props.column);
  }

  //pass in row, column, number
  //0-8 for uncovered safe spaces, 9 for covered, 10 for flagged, -1 for exposed mine
  render() {
    var fontColors = {
      0: 'black',
      1: 'blue',
      2: 'green',
      3: 'red',
      4: 'purple',
      5: 'maroon',
      6: 'turquoise',
      7: 'gray',
      8: 'black',
      9: 'black',
      10: 'gold'
    };
    var color = '#dddddd';
    var text = this.props.number;
    if (this.props.number === 9) {
      color = '#818181';
      text = '';
    }
    if (this.props.number === 10) {
      color = '#818181';
      text = 'P';
    }
    if (this.props.number === -1) {
      color = '#ff0000';
      text = '*';
    }
    if (this.props.number === 0) {
      text = '';
    }
    const styles = {
      position: 'absolute',
      top: this.props.row * 50 + 20,
      left: this.props.column * 50,
      width: 45,
      height: 45,
      borderRadius: 5,
      textAlign: 'center',
      lineHeight: 1.5,
      fontFamily: 'Arial',
      fontSize: 30,
      color: fontColors[this.props.number],
      backgroundColor: color
    };
    return <span style={styles} onClick={this.click} onContextMenu={this.rightClick}>{text}</span>;
  }
}
export default Space;