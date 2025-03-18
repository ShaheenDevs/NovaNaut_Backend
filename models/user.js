'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNo: DataTypes.STRING,
    profile: DataTypes.STRING,
    country: DataTypes.STRING,
    password: DataTypes.STRING,
    kyc: DataTypes.BOOLEAN,
    blocked: DataTypes.BOOLEAN,
    subscribedPlan: DataTypes.STRING,
    refId: DataTypes.STRING,
    balance: DataTypes.FLOAT,
    emailVerified: DataTypes.BOOLEAN,
    phoneVerified: DataTypes.BOOLEAN,
    miningLevel: DataTypes.INTEGER,
    boostingPlanId: DataTypes.INTEGER,
    boostingExpiryDate: DataTypes.DATE,
    miningStartTime:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};