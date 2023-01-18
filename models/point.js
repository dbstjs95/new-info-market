"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Point extends Model {
    static associate(models) {
      Point.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Point.hasMany(models.PointRefund, {
        foreignKey: "pointId",
        sourceKey: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Point.init(
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
      point: {
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
      },
      payment_method_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: "Point",
      // tableName: "Point",
      paranoid: true,
      // mb4 -> 이모티콘도 사용 가능
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return Point;
};
