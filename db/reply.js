const Reply = require("../models/reply");

export async function writeReply(content, userId, infoId) {
  return await Reply.create({
    content,
    userId,
    infoId,
  });
}

export async function modifyReply(content, userId, infoId, replyId) {
  return await Reply.update(
    {
      content,
      userId,
      infoId,
    },
    { where: { id: replyId } }
  );
}

export async function deleteReply(replyId) {
  return await Reply.destroy({
    where: { id: replyId },
  });
}

export async function getReply(replyId) {
  return await Reply.findOne({
    where: { id: replyId },
  });
}
