const Like = require("../models/like");

export async function likeClick(userId, infoId) {
  return await Like.create({
    userId,
    infoId,
  });
}

export async function likeClickCancel(userId, infoId) {
  return await Like.destroy({
    where: { userId, infoId },
  });
}

export async function findUser(userId, infoId) {
  return await Like.findOne({
    where: { userId, infoId },
  });
}
