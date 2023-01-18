"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Info extends Model {
    static associate(models) {
      Info.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Info.hasMany(models.Reply, {
        foreignKey: "infoId",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Info.hasMany(models.Like, {
        foreignKey: "infoId",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Info.hasMany(models.Payment, {
        foreignKey: "infoId",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Info.init(
    {
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      targetPoint: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "Free",
      },
      totalViews: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      totalLikes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      activate: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      file: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: "Info",
      tableName: "Info",
      paranoid: true,
      // mb4 -> 이모티콘도 사용 가능
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return Info;
};
