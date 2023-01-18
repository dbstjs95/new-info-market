const Payment = require("../models/payment");
const { Sequelize, Op } = require("sequelize");
const User = require("../models/user");
const Info = require("../models/info");

export async function createPayment(userId, infoId, state, tid) {
  return await Payment.create({
    userId,
    infoId,
    state,
    tid,
  });
}

export async function getPayment(infoId) {
  return await Payment.findOne({
    where: {
      id: infoId,
    },
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      [Sequelize.col("Info.title"), "title"],
      [Sequelize.col("Info.content"), "content"],
      [Sequelize.col("Info.targetPoint"), "targetPoint"],
      [Sequelize.col("Info.totalViews"), "totalViews"],
      [Sequelize.col("Info.totalLikes"), "totalLikes"],
      "userId",
      "infoId",
      "tid",
    ],
    include: [
      {
        model: User,
        attributes: [],
      },
      {
        model: Info,
        attributes: [],
      },
    ],
  });
}

export async function refundPayment(tid) {
  return await Payment.update(
    {
      state: "refund",
    },
    {
      where: {
        tid,
      },
    }
  );
}

export async function getPayments(userId, pages, limit, state) {
  return await Payment.findAndCountAll({
    where: {
      id: userId,
      state,
    },
    limit,
    offset: (pages - 1) * 10,
    order: [["createdAt", "desc"]],
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      [Sequelize.col("Info.title"), "title"],
      [Sequelize.col("Info.content"), "content"],
      [Sequelize.col("Info.targetPoint"), "targetPoint"],
      [Sequelize.col("Info.totalViews"), "totalViews"],
      [Sequelize.col("Info.totalLikes"), "totalLikes"],
      "state",
      "tid",
      "userId",
      "infoId",
      "createdAt",
    ],
    include: [
      {
        model: User,
        attributes: [],
      },
      {
        model: Info,
        attributes: [],
      },
    ],
  });
}

export async function getUserPayment(infoId, userId) {
  return await Payment.findOne({
    where: {
      userId,
      infoId,
    },
  });
}
