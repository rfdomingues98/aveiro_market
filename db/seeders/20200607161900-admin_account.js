"use strict";
const crypto = require("crypto");
const {
  v4: uuidv4
} = require("uuid");
const password = crypto.createHash("md5").update("password").digest("hex");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [{
          id: uuidv4(),
          userType: 0,
          email: "customer@mail.com",
          password: password,
          displayName: "",
          firstName: "Ricardo",
          lastName: "Domingues",
          phone: 231513232,
          description: '',
          facebook: "",
          instagram: "",
          image: "default-user.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          userType: 1,
          email: "trendy@mail.com",
          password: password,
          displayName: "Trendy Store",
          firstName: "",
          lastName: "",
          phone: 231513232,
          description: 'Trendy Store Description.',
          facebook: "",
          instagram: "",
          image: "default-user.png",
          logo: "trendy-logo.png",
          banner: "trendy-store.jpg",
          address: "Rua das Glicinias nº3 AA, 3810-700 Aveiro",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};