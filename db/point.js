const Point = require("../models/point");
const { Sequelize, Op, where } = require("sequelize");
const User = require("../models/user");

export async function createPoint(
  imp_uid,
  state,
  userId,
  point,
  merchant_uid,
  payment_method_type
) {
  return await Point.create({
    imp_uid,
    state,
    userId,
    point,
    merchant_uid,
    payment_method_type,
  });
}

export async function findUserChargePoint(userId, merchant_uid) {
  return await Point.findOne({
    where: {
      userId,
      merchant_uid,
    },
    attributes: [
      "point",
      "merchant_uid",
      "imp_uid",
      "payment_method_type",
      "createdAt",
      "state",
      [Sequelize.col("User.nickname"), "nickname"],
    ],
    include: [
      {
        model: User,
        attributes: [],
      },
    ],
  });
}

export async function editPoint(tid) {
  return await Point.update(
    {
      state: "approve",
    },
    {
      where: {
        tid,
      },
    }
  );
}

export async function removePoint(userId, merchant_uid, imp_uid) {
  return await Point.destroy({
    where: {
      userId,
      merchant_uid,
      imp_uid,
    },
  });
}

export async function partPointRefund(
  userId,
  merchant_uid,
  imp_uid,
  cancel_point
) {
  return await Point.update(
    {
      point: cancel_point,
    },
    {
      where: {
        userId,
        merchant_uid,
        imp_uid,
      },
    }
  );
}

// export async function findAndUpdate(
//   imp_uid,
//   state,
//   userId,
//   point,
//   merchant_uid,
//   payment_method_type,
// ) {
//   return await Point.({
//     tid,
//     state: '',
//   });
// }

export async function findUserPaidbyUserId(userId) {
  return await Point.findAll({
    where: {
      userId,
    },
    attributes: [
      "id",
      "state",
      "point",
      [Sequelize.col("User.nickname"), "nickname"],
      "createdAt",
      "merchant_uid",
      "imp_uid",
      "payment_method_type",
    ],
    include: {
      model: User,
      attributes: [],
    },
  });
}
