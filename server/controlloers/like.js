const userDb = require("../db/user");
const infoDb = require("../db/info");
const likeDb = require("../db/like");

module.exports = {
  like: async (req, res) => {
    const { infoId } = req.params;
    const { userId } = req;

    const userInfo = await userDb.findPkUser(Number(userId));
    const likeInfo = await likeDb.findUser(Number(userId), Number(infoId));
    console.log(userInfo);
    console.log(likeInfo);

    if (userInfo?.id === likeInfo?.userId) {
      return res.status(403).json({ message: "이미 추천한 게시물입니다." });
    }

    await likeDb.likeClick(Number(userId), Number(infoId));

    const info = await infoDb.getInfo(Number(infoId));

    await infoDb.LikesAdd(info?.id, Number(info?.totalLikes));

    return res.status(200).json({ message: "해당 게시물을 추천했습니다." });
  },
  likeCancel: async (req, res) => {
    const { infoId } = req.params;
    const { userId } = req;

    const userInfo = await userDb.findPkUser(userId);
    const likeInfo = await likeDb.findUser(Number(userId), Number(infoId));
    console.log(userInfo);
    console.log(likeInfo);

    if (userInfo !== null && likeInfo === null) {
      return res
        .status(403)
        .json({ message: "이미 추천을 취소한 게시물입니다." });
    }

    await likeDb.likeClickCancel(userId, Number(infoId));

    const info = await infoDb.getInfo(Number(infoId));
    await infoDb.LikesSub(info?.id, Number(info?.totalLikes));

    return res
      .status(200)
      .json({ message: "해당 게시물의 추천을 취소했습니다." });
  },
};
