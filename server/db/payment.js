const { Payment, User, Info } = require("../models");
const { Sequelize, Op } = require("sequelize");

async function createPayment(userId, infoId, state, tid) {
  return await Payment.create({
    userId,
    infoId,
    state,
    tid,
  });
}

async function getPayment(infoId) {
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

async function refundPayment(tid) {
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

async function getPayments(userId, pages, limit, state) {
  return await Payment.findAndCountAll({
    where: {
      userId,
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
      [
        Sequelize.fn(
          "DATE_FORMAT",
          Sequelize.col("Payment.createdAt"),
          "%Y-%m-%d %H:%i:%s"
        ),
        "createdAt",
      ],
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

async function getUserPayment(infoId, userId) {
  return await Payment.findOne({
    where: {
      userId,
      infoId,
    },
  });
}

module.exports = {
  createPayment,
  getPayment,
  refundPayment,
  getPayments,
  getUserPayment,
};
