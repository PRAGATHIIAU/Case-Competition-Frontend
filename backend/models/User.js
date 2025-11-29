/**
 * User Sequelize Model
 * Defines the User table structure for PostgreSQL
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'mentor', 'alumni', 'faculty', 'admin', 'judge', 'guest_speaker'),
    allowNull: false,
    defaultValue: 'student'
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  // Unified Identity: Alumni can have multiple roles
  isMentor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  isJudge: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  isSpeaker: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Additional fields for different roles
  year: {
    type: DataTypes.STRING,
    allowNull: true // For students: 'Freshman', 'Sophomore', 'Junior', 'Senior'
  },
  major: {
    type: DataTypes.STRING,
    allowNull: true // For students
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true // For mentors/alumni
  },
  expertise: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [] // For alumni/mentors
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

module.exports = User;

