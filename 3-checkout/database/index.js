const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('checkout', 'root', 'feedtheB3AR', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});

module.exports = sequelize;