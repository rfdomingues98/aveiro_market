"use strict";
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const password = crypto.createHash("md5").update("password").digest("hex");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          id: uuidv4(),
          userType: 0,
          email: "customer@mail.com",
          password: password,
          displayName: "",
          firstName: "Ricardo",
          lastName: "Domingues",
          phone: 231513232,
          facebook: "",
          instagram: "",
          image: "default-user.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          userType: 1,
          email: "admin@mail.com",
          password: password,
          displayName: "Trendy Store",
          firstName: "",
          lastName: "",
          phone: 231513232,
          facebook: "",
          instagram: "",
          image: "default-user.png",
          address: "Rua das Glicinias nº3 AA, 3810-700 Aveiro",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
