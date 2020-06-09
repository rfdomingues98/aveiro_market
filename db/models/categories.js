'use strict';
module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define('Categories', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    timestamps: false,
  });
  Categories.associate = function (models) {

  };
  return Categories;
};