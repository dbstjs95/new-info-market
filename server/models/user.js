"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Info, {
        foreignKey: "userId",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Reply, {
        foreignKey: "userId",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Like, {
        foreignKey: "userId",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Payment, {
        foreignKey: "userId",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.Point, {
        foreignKey: "userId",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.PointRefund, {
        foreignKey: "userId",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      grade: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "Bronze",
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      img: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: "User",
      tableName: "User",
      paranoid: true,
      // mb4 -> 이모티콘도 사용 가능
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return User;
};
