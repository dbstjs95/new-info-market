const replyDb = require("../db/reply");
const userDb = require("../db/user");

module.exports = {
  writeReply: async (req, res) => {
    const { infoId } = req.params;
    const { userId } = req;
    const { content } = req.body;

    //const exUser = await userDb.findPkUser(userId);
    const replyData = await replyDb.writeReply(content, userId, Number(infoId));

    if (!content) {
      return res.status(400).json({ message: "댓글을 입력해 주세요" });
    }

    return res.status(203).json({
      replyId: replyData.id,
      createdAt: replyData.createdAt,
      message: "댓글을 작성했습니다.",
    });
  },

  putReply: async (req, res) => {
    const { infoId, replyId } = req.params;
    const { userId } = req;
    const { content } = req.body;

    //const exUser = await userDb.findPkUser(userId);
    const exReply = await replyDb.getReply(replyId);

    if (!content) {
      return res.status(400).json({ message: "댓글을 입력해 주세요" });
    }

    if (userId !== exReply?.userId) {
      return res
        .status(403)
        .json({ message: "해당 댓글을 작성한 유저가 아닙니다." });
    }

    await replyDb.modifyReply(
      content,
      userId,
      Number(infoId),
      Number(exReply?.id)
    );

    return res.status(201).json({ replyId, message: "댓글을 수정했습니다." });
  },

  removeReply: async (req, res) => {
    const { infoId, replyId } = req.params;
    const { userId } = req;

    const exReply = await replyDb.getReply(replyId);

    if (userId !== exReply?.userId) {
      if (exReply?.userId === undefined) {
        return res.status(400).json({ message: "이미 삭제된 댓글입니다." });
      } else {
        return res
          .status(403)
          .json({ message: "해당 댓글을 작성한 유저가 아닙니다." });
      }
    }

    await replyDb.deleteReply(replyId);

    return res.status(203).json({ replyId, message: "댓글을 삭제했습니다." });
  },
};
