const Point = require("../models/point");
const { Sequelize, Op, where } = require("sequelize");
const User = require("../models/user");
const PointRefund = require("../models/pointRefund");

export async function createPointRefund(
  imp_uid,
  merchant_uid,
  userId,
  cancel_point,
  reason,
  state
) {
  return await PointRefund.create({
    userId,
    reason,
    merchant_uid,
    imp_uid,
    cancel_point,
    state,
  });
}

export async function findRefund(userId) {
  return await PointRefund.findAll({
    where: {
      userId,
    },
  });
}
