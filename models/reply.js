"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate(models) {
      Reply.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Reply.belongsTo(models.Info, {
        foreignKey: "infoId",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Reply.init(
    {
      content: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
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
      modelName: "Reply",
      tableName: "Reply",
      paranoid: true,
      // mb4 -> 이모티콘도 사용 가능
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return Reply;
};
