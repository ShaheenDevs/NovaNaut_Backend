'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KYC extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  KYC.init({
    userId: DataTypes.INTEGER,
    userImageUrl: DataTypes.STRING,
    cnicFrontUrl: DataTypes.STRING,
    cnicBackUrl: DataTypes.STRING,
    status: DataTypes.STRING,
    rejectionReason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'KYC',
  });
  return KYC;
};