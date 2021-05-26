import React from 'react';
class GhostSpace extends React.Component {
  constructor(props) {
    super(props);
    this.flashDelay = 300;
    this.playPiece = this.playPiece.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.flasher = this.flasher.bind(this);
    this.state = {
      //used for animation only!
      //use this.prop.color to determine the color of the piece
      currentColor: '#d7d7d7',
      flashing: false
    };
  }

  mouseEnter() {
    this.setState({
      flashing: true
    }, this.flasher);
  }

  mouseLeave() {
    this.setState({
      flashing: false
    });
  }

  playPiece() {
    this.props.addPiece(this.props.column);
  }

  flasher() {
    var cb = function() {
      if (this.state.flashing) {
        setTimeout(this.flasher, this.flashDelay);
      } else {
        this.setState({
          currentColor: '#d7d7d7'
        });
      }
    };
    cb = cb.bind(this);
    if (this.state.currentColor === this.props.color) {
      this.setState({
        currentColor: '#d7d7d7'
      }, cb);
    } else {
      this.setState({
        currentColor: this.props.color
      }, cb);

    }
  }

  //receive zero-indexed row/column as prop, will need to do some
  //math to calculate css pixels
  //use row 0, column 0 as top left space to make math easier
  render() {
    const styles = {
      position: 'absolute',
      top: 30,
      left: this.props.column * 120,
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: this.state.currentColor
    };
    return <span style={styles} onClick={this.playPiece} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}></span>;
  }
}

export default GhostSpace;