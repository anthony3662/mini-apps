import React from 'react';
class Shipping extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      address: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      allFieldsMessage: false
    };
  }

  handleChange(event) {
    var value = event.target.value;
    var name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.address, this.state.line2, this.state.city, this.state.state, this.state.zip, this.state.phone);
    if (!this.state.address || !this.state.city || !this.state.state ||  !this.state.zip || !this.state.phone) {
      this.setState({
        allFieldsMessage: true
      });
    } else {
      //call handler passed as prop
      this.props.finished(JSON.parse(JSON.stringify(this.state)));
    }
  }

  render() {
    return (
      <div>
        <h3>Shipping Address</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            Address:
            <input
              name="address"
              type="text"
              value={this.state.address}
              onChange={this.handleChange}
            />
          </label> <br />
          <label>
            Address Line 2:
            <input
              name="line2"
              type="text"
              value={this.state.line2}
              onChange={this.handleChange}
            />
          </label> <br />
          <label>
            City
            <input
              name="city"
              type="text"
              value={this.state.city}
              onChange={this.handleChange}
            />
          </label>
          <label>
            State
            <input
              name="state"
              type="text"
              value={this.state.state}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Zip
            <input
              name="zip"
              type="number"
              value={this.state.zip}
              onChange={this.handleChange}
            />
          </label> <br />
          <label>
            Phone
            <input
              name="phone"
              type="number"
              value={this.state.phone}
              onChange={this.handleChange}
            />
          </label> <br />
          <input type="submit" value="Proceed to Payment" />
        </form>
        {this.state.allFieldsMessage &&
        <div className="allFieldsMessage">
          <p>All fields are required</p>
        </div>
        }
      </div>
    );
  }
}
export default Shipping;

