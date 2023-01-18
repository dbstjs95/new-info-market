const { Point, User, PointRefund } = require("../models");
const { Sequelize, Op, where } = require("sequelize");

async function createPointRefund(
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

async function findRefund(userId) {
  return await PointRefund.findAll({
    where: {
      userId,
    },
  });
}

module.exports = { createPointRefund, findRefund };
