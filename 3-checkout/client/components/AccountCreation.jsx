import React from 'react';
class AccountCreation extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      name: '',
      email: '',
      password: '',
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
    if (!this.state.name || !this.state.email || !this.state.password) {
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
        <h3>New Account</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            What's your name?
            <input
              name="name"
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </label> <br />
          <label>
            Email
            <input
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </label> <br />
          <label>
            New Password
            <input
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </label> <br />
          <input type="submit" value="Proceed to Shipping" />
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
export default AccountCreation;

