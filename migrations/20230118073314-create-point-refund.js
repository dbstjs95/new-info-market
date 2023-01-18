"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PointRefunds", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      state: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      pointId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Points",
          key: "id",
        },
      },
      cancel_point: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      merchant_uid: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      imp_uid: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      reason: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PointRefunds");
  },
};
