const userDb = require("../db/user");
const bcrypt = require("./functions/bcrypt");
const infoDb = require("../db/info");
const paymentDb = require("../db/payment");
const pointDb = require("../db/point");
const pointRefundDb = require("../db/pointRefund");

module.exports = {
  getUsersInfo: async (req, res) => {
    const { userId } = req.params;

    if (userId != req.userId) {
      return res.status(403).json({ message: "유저가 일치하지 않습니다." });
    }

    const user = await userDb.findPkUser(Number(userId));

    if (!user) {
      return res
        .status(406)
        .json({ message: "해당 유저가 존재하지 않습니다." });
    }

    return res.status(200).json({ user, message: "유저 정보를 가져왔습니다." });
  },
  checkPassword: async (req, res) => {
    const { userId } = req.params;
    const { password } = req.body;

    if (userId != req.userId) {
      return res.status(403).json({ message: "유저가 일치하지 않습니다." });
    }

    const user = await userDb.findPkUser(Number(userId));

    const { password: dbPwd } = user;
    if (!dbPwd)
      return res
        .status(500)
        .json({ message: "DB에서 유저 비밀번호를 조회하는 데 실패했습니다." });

    const verification = await bcrypt
      .comparePw(password, dbPwd)
      .catch((err) => {
        console.log(err);
      });

    if (!verification) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않음" });
    }

    return res
      .status(200)
      .json({ message: "비밀번호가 일치함을 확인했습니다." });
  },
  editUsersInfo: async (req, res) => {
    const { userId } = req.params;

    if (userId != req.userId) {
      return res.status(403).json({ message: "유저가 일치하지 않습니다." });
    }

    const user = await userDb.findPkUser(Number(userId));

    if (!user) {
      return res
        .status(406)
        .json({ message: "해당 유저가 존재하지 않습니다." });
    }

    let email;
    let password;
    let phone;
    let nickname;

    if (req.body.email) {
      email = req.body.email;
    } else {
      email = user.email;
    }

    if (req.body.password) {
      password = await bcrypt.hash(req.body.password).catch((err) => {
        console.log(err);
      });
    } else {
      password = user.password;
    }

    if (req.body.phone) {
      phone = req.body.phone;
    } else {
      phone = user.phone;
    }

    if (req.body.nickname) {
      nickname = req.body.nickname;
    } else {
      nickname = user.nickname;
    }

    await userDb
      .editUserInfo(Number(userId), email, password, nickname, phone)
      .catch(() => {
        return res
          .status(400)
          .json({ message: "회원 정보를 수정하는데 실패했습니다." });
      });

    return res.status(200).json({ message: "유저 정보를 수정 했습니다." });
  },

  usersWriteInfo: async (req, res) => {
    const { pages, limit } = req.query;
    const { userId } = req;

    const info = await infoDb.getMyInfos(
      Number(pages),
      Number(limit),
      Number(userId)
    );

    if (info.count === 0) {
      return res
        .status(406)
        .json({ message: "해당 게시물이 존재하지 않습니다." });
    }

    return res
      .status(200)
      .json({ info, message: "내가 쓴 게시물을 불러왔습니다." });
  },

  usersOrderInfo: async (req, res) => {
    const { pages, limit } = req.query;
    const state = "paid";
    const findOrders = await paymentDb.getPayments(
      Number(req.userId),
      Number(pages),
      Number(limit),
      state
    );

    console.log("findOrders: ", findOrders);

    if (findOrders.count === 0) {
      return res.status(400).json({ message: "구매한 게시물이 없습니다." });
    }

    return res.status(200).json({
      info: findOrders,
      message: "내가 구매한 게시물을 불러왔습니다.",
    });
  },
  usersRefundInfo: async (req, res) => {
    const { pages, limit } = req.query;
    const state = "refund";
    const findOrders = await paymentDb.getPayments(
      Number(req.userId),
      Number(pages),
      Number(limit),
      state
    );

    if (findOrders.count === 0) {
      return res.status(400).json({ message: "환불한 게시물이 없습니다." });
    }

    return res.status(200).json({
      info: findOrders,
      message: "내가 환불한 게시물을 불러왔습니다.",
    });
  },
  postImg: async (req, res) => {
    const { profileImg } = req.body;
    const { userId } = req;

    await userDb.postImg(profileImg, Number(userId));
    return res
      .status(200)
      .json({ message: "이미지를 업로드 하는데 성공하였습니다." });
  },
  checkNickname: async (req, res) => {
    const findNickname = await userDb.checkNickname(req.body.nickname);

    if (findNickname) {
      return res.status(400).json({ message: "중복된 닉네임 입니다." });
    }

    return res.status(200).json({ message: "사용할 수 있는 닉네임 입니다." });
  },
  paidPoint: async (req, res) => {
    const { userId } = req.params;

    if (userId != req.userId) {
      return res.status(403).json({ message: "유저가 일치하지 않습니다." });
    }

    const user = await userDb.findPkUser(Number(userId));

    if (!user) {
      return res
        .status(406)
        .json({ message: "해당 유저가 존재하지 않습니다." });
    }

    const paidPoint = await pointDb.findUserPaidbyUserId(Number(userId));

    if (!paidPoint) {
      return res
        .status(406)
        .json({ message: "포인트를 충전한 내역이 없습니다." });
    }

    return res
      .status(200)
      .json({ paidPoint, message: "포인트 충전 내역을 불러왔습니다." });
  },
  checkEmail: async (req, res) => {
    const editInfo = await userDb.findUser(req.body.email);

    if (editInfo) {
      return res.status(400).json({ message: "중복된 Email 입니다." });
    }

    return res.status(200).json({ message: "사용할 수 있는 Email 입니다." });
  },
  getRefundPoint: async (req, res) => {
    const refundPoint = await pointRefundDb.findRefund(Number(req.userId));

    if (!refundPoint) {
      return res.status(406).json({ message: "포인트 환불 내역이 없습니다." });
    }

    return res.status(200).json({
      refund: refundPoint,
      message: "포인트 환불 내역을 불러왔습니다.",
    });
  },
};
