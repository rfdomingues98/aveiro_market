'use strict';
module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    idCustomer: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    idSeller: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // 0 - On Hold, 1 - Accepted, 2 - Rejected
    },
    products: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    payment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  }, {
    timestamps: false,
  });
  Orders.associate = function (models) {

  };
  return Orders;
};