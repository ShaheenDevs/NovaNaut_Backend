'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Invitation.belongsTo(models.User, { foreignKey: "reReferralBy", as: "user" });
     }
  }
  Invitation.init({
    reReferralBy: DataTypes.INTEGER,
    newUserId: DataTypes.INTEGER,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Invitation',
  });
  return Invitation;
};