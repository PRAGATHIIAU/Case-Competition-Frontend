/**
 * Event Sequelize Model
 * Defines the Event table structure for PostgreSQL
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'workshop' // 'workshop' or 'meetup'
  }
}, {
  tableName: 'events',
  timestamps: true,
  underscored: true
});

module.exports = Event;



