'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airdrop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Airdrop.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Airdrop.init({
    userId: DataTypes.INTEGER,
    tokens: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    claimedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Airdrop',
  });
  return Airdrop;
};