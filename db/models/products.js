'use strict';
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // 0 - qty, 1 - weight
    },
    category: {
      type: DataTypes.UUID,
      allowNull: false
    },
    seller: {
      type: DataTypes.UUID,
      allowNull: false
    },
    stock: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'product_placeholder.png',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    timestamps: false,
  });
  Products.associate = function (models) {

  };
  return Products;
};