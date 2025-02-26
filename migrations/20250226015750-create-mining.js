'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Minings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
      },
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      miningRate: {
        type: DataTypes.FLOAT, // e/h (example: 0.01 nona/h)
        defaultValue: 0.01
      },
      minedAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      timeElapsed: {
        type: Sequelize.INTEGER,
        defaultValue: DataTypes.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Minings');
  }
};