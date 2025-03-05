'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BoostingPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BoostingPlan.init({
    name: DataTypes.STRING,
    durationDays: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    image: DataTypes.STRING,
    power: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'BoostingPlan',
  });
  return BoostingPlan;
};