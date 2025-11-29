/**
 * Lecture Sequelize Model
 * Defines the Lecture table structure for PostgreSQL
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Lecture = sequelize.define('Lecture', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  professorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'lectures',
  timestamps: true,
  underscored: true
});

// Define associations
Lecture.belongsTo(User, { foreignKey: 'professorId', as: 'professor' });
User.hasMany(Lecture, { foreignKey: 'professorId', as: 'lectures' });

module.exports = Lecture;



