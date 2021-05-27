import React from 'react';
class Space extends React.Component {
  constructor(props) {
    super(props);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseClick = this.mouseClick.bind(this);
  }

  mouseEnter() {

    //call app handler for placing ships
    if (this.props.player === 'player') {
      this.props.playerHoverHandler(this.props.row, this.props.column);
    }
  }

  mouseClick() {
    if (this.props.player === 'player') {
      this.props.playerClickHandler(this.props.row, this.props.column);
    }
  }

  //will pass in color and colorKey
  //row, column, and player which can be 'player' or opponent
  render() {
    var borderRadius = 15;
    if (this.props.colorKey >= 2 && this.props.colorKey <= 5) {
      borderRadius = 4;
    }
    var top = this.props.row * 35;
    if (this.props.player === 'player') {
      top += 400;
    }
    const styles = {
      position: 'absolute',
      top: top,
      left: this.props.column * 35,
      width: 30,
      height: 30,
      borderRadius,
      backgroundColor: this.props.color
    };
    return <span style={styles} onMouseEnter={this.mouseEnter} onClick={this.mouseClick}></span>;
  }
}

export default Space;