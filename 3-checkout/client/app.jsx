import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import AccountCreation from './components/AccountCreation.jsx'
import Shipping from './components/Shipping.jsx';
import Billing from './components/Billing.jsx';
class App extends React.Component {
  constructor(props) {
    super(props);

    this.sendTransaction = this.sendTransaction.bind(this);
    this.completeAccountCreation = this.completeAccountCreation.bind(this);
    this.completeShipping = this.completeShipping.bind(this);
    this.completeBilling = this.completeBilling.bind(this);
    this.state = {
      step: 'accountCreation',
      inputs: {}
    };
  }

  completeAccountCreation(input) {
    var updateInputs = JSON.parse(JSON.stringify(this.state.inputs));
    Object.assign(updateInputs, input);
    this.setState({
      step: 'shipping',
      inputs: updateInputs
    });
  }

  completeShipping(input) {
    var updateInputs = JSON.parse(JSON.stringify(this.state.inputs));
    Object.assign(updateInputs, input);
    this.setState({
      step: 'billing',
      inputs: updateInputs
    });
  }

  completeBilling(input) {
    var updateInputs = JSON.parse(JSON.stringify(this.state.inputs));
    Object.assign(updateInputs, input);
    this.setState({
      step: 'complete',
      inputs: updateInputs
    }, this.sendTransaction);

  }

  sendTransaction() {
    var mail = JSON.parse(JSON.stringify(this.state.inputs));
    delete mail.allFieldsMessage;
    axios.post('./transactions', mail);
  }

  render() {
    return(
      <div>
        <h2>Checkout</h2>
        {this.state.step === 'accountCreation' &&
          <AccountCreation finished={this.completeAccountCreation} />
        }
        {this.state.step === 'shipping' &&
          <Shipping finished={this.completeShipping} />
        }
        {this.state.step === 'billing' &&
          <Billing finished={this.completeBilling} />
        }
        {this.state.step === 'complete' &&
          <div>
            <h3>Thanks for your purchase!</h3>
            <p>It should hit your mailbox within 2 to 3 years. Enjoy!</p>
          </div>

        }
      </div>

    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));