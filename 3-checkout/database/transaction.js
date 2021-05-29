const {DataTypes} = require('sequelize');
var sequelize = require('./index.js');

const Transaction = sequelize.define('Transaction', {
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  line2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  zip: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  card: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  cvv: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  expiry: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  billingZip: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }
});
Transaction.sync();
module.exports = {
  //return promise
  getAll: function() {
    return Transaction.findAll();
  },

  create: function(transaction) {
    return Transaction.create(transaction)
  }
}