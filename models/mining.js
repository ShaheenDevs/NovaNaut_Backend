'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mining extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mining.init({
    userId: DataTypes.INTEGER,
    balance: DataTypes.INTEGER,
    miningRate: DataTypes.FLOAT,
    minedAmount: DataTypes.INTEGER,
    timeElapsed: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Mining',
  });
  return Mining;
};