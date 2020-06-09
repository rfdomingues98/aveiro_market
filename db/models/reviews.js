'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reviews = sequelize.define('Reviews', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    idProduct: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    idUser: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
  });
  Reviews.associate = function (models) {
    // associations can be defined here
    Reviews.belongsTo(models.Users, {
      foreignKey: 'idUser'
    });
  };
  return Reviews;
};