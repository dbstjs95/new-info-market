"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Like.belongsTo(models.Info, {
        foreignKey: "infoId",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Like.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      infoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Info",
          key: "id",
        },
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: "Like",
      // tableName: "Like",
      paranoid: true,
      // mb4 -> 이모티콘도 사용 가능
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
  return Like;
};
