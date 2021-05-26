import React from 'react';
class Space extends React.Component {
  constructor(props) {
    super(props);
  }

  //receive zero-indexed row/column as prop, will need to do some
  //math to calculate css pixels
  //use row 0, column 0 as top left space to make math easier
  render() {
    const styles = {
      position: 'absolute',
      top: this.props.row * 90 + 130,
      left: this.props.column * 120,
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: this.props.color
    };
    return <span style={styles}></span>;
  }
}

export default Space;