'use strict';
const {
  v4: uuidv4
} = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Categories',
      [{
          id: uuidv4(),
          category: 'Food',
        },
        {
          id: uuidv4(),
          category: 'Groceries',
        },
        {
          id: uuidv4(),
          category: 'Health',
        },
        {
          id: uuidv4(),
          category: 'Electronics',
        },
        {
          id: uuidv4(),
          category: 'Apparel&Shoes',
        },
        {
          id: uuidv4(),
          category: 'Promos',
        },
      ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Categories", null, {});
  }
};