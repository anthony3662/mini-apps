import React from 'react';
class Billing extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      card: undefined,
      cvv: undefined,
      expiry: '',
      billingZip: '',
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
    if (!this.state.card || !this.state.cvv || !this.state.expiry || !this.state.billingZip) {
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
        <h3>Payment</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            Card Number
            <input
              name="card"
              type="number"
              value={this.state.card}
              onChange={this.handleChange}
            />
          </label>
          <label>
            CVV
            <input
              name="cvv"
              type="password"
              value={this.state.cvv}
              onChange={this.handleChange}
            />
          </label> <br />
          <label>
            Expiry MMYYYY
            <input
              name="expiry"
              type="number"
              value={this.state.expiry}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Billing ZIP
            <input
              name="billingZip"
              type="number"
              value={this.state.billingZip}
              onChange={this.handleChange}
            />
          </label> <br />
          <input type="submit" value="Complete Purchase" />
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
export default Billing;

