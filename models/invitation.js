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
      Invitation.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });
      Invitation.belongsTo(models.User, { foreignKey: "receiverId", as: "receiver" });
     }
  }
  Invitation.init({
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Invitation',
  });
  return Invitation;
};