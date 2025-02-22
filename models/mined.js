'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mined extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mined.init({
    totalMineableTokens: DataTypes.INTEGER,
    totalMinedTokens: DataTypes.INTEGER,
    remainderTokens: DataTypes.INTEGER,
    isAllow: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Mined',
  });
  return Mined;
};