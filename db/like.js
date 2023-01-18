const { Like } = require("../models");

async function likeClick(userId, infoId) {
  return await Like.create({
    userId,
    infoId,
  });
}

async function likeClickCancel(userId, infoId) {
  return await Like.destroy({
    where: { userId, infoId },
  });
}

async function findUser(userId, infoId) {
  return await Like.findOne({
    where: { userId, infoId },
  });
}

module.exports = { likeClick, likeClickCancel, findUser };
