'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      idCustomer: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      idSeller: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      state: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 - On Hold, 1 - Accepted, 2 - Rejected
      },
      products: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      payment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Orders');
  }
};