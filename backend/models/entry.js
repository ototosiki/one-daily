const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Entry = sequelize.define('Entry', {
  text: {
    type: DataTypes.STRING(140),
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
});

module.exports = Entry;