"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PointRefund extends Model {
    static associate(models) {
      PointRefund.belongsto(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      PointRefund.belongsTo(models.Point, {
        foreignKey: "pointId",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  PointRefund.init(
    {
      state: {
        type: DataTypes.STRING(50),
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
      pointId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Point",
          key: "id",
        },
      },
      cancel_point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      merchant_uid: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      imp_uid: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      reason: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: "PointRefund",
      tableName: "PointRefund",
      paranoid: true,
      // mb4 -> 이모티콘도 사용 가능
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return PointRefund;
};
