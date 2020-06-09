'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 - qty, 1 - weight
      },
      category: {
        type: Sequelize.UUID,
        allowNull: false
      },
      seller: {
        type: Sequelize.UUID,
        allowNull: false
      },
      stock: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'product_placeholder.png',
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products');
  }
};