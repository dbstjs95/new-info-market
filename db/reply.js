const { Reply } = require("../models");

async function writeReply(content, userId, infoId) {
  return await Reply.create({
    content,
    userId,
    infoId,
  });
}

async function modifyReply(content, userId, infoId, replyId) {
  return await Reply.update(
    {
      content,
      userId,
      infoId,
    },
    { where: { id: replyId } }
  );
}

async function deleteReply(replyId) {
  return await Reply.destroy({
    where: { id: replyId },
  });
}

async function getReply(replyId) {
  return await Reply.findOne({
    where: { id: replyId },
  });
}

module.exports = { writeReply, modifyReply, deleteReply, getReply };
