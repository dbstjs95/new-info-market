const userDb = require("../db/user");
const adminDb = require("../db/admin");
const bcrypt = require("../controlloers/functions/bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("./functions/jwtToken");

module.exports = {
  adminSignUp: async (req, res) => {
    const { email, password } = req.body;

    const exAdmin = await adminDb.findAdmin(email);

    if (exAdmin) {
      return res.status(409).json({ message: "중복된 유저 입니다." });
    }

    const hashPw = await bcrypt.hash(password).catch((err) => {
      console.log(err);
    });

    const test = await adminDb.createAdmin(email, hashPw);

    return res.status(201).json({
      id: test.id,
      message: "회원가입에 성공 했습니다.",
    });
  },

  adminLogin: async (req, res) => {
    const { email, password } = req.body;
    const admin = await adminDb.findAdmin(email);

    if (!admin) {
      return res.status(401).json({ message: "해당 유저가 없습니다." });
    }
    const { id, grade } = admin;

    const verification = await bcrypt
      .comparePw(password, admin.password)
      .catch((err) => {
        console.log(err);
      });

    if (!verification) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않음" });
    }

    const accToken = generateAccessToken(id, grade);
    const refreshToken = generateRefreshToken(id, grade);
    const cookieOptions = {
      httpOnly: true,
    };

    return res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(201)
      .json({
        id,
        grade,
        accToken: accToken,
        message: "로그인에 성공 했습니다.",
      });
  },

  adminLogOut: (req, res) => {
    res
      .cookie("refreshToken", "")
      .status(200)
      .json({ message: "로그아웃에 성공했습니다." });
  },

  getUsers: async (req, res) => {
    const { pages, limit } = req.query;
    const { grade } = req;
    // console.log(grade);

    if (grade !== "admin") {
      return res.status(403).json({ message: "해당 권한이 없습니다." });
    }

    const users = await userDb.findUsers(Number(pages), Number(limit));
    //   .catch(() => {
    //     return res
    //       .status(400)
    //       .json({ message: '회원 정보를 불러오는데 실패했습니다.' });
    //   });
    // console.log(users);

    if (users.count === 0) {
      return res.status(406).json({ message: "유저가 존재하지 않습니다." });
    }

    res.status(200).json({ users, message: "가입한 유저들을 불러왔습니다." });
  },

  editUserInfo: async (req, res) => {
    const { userId } = req.params;

    if (req.grade !== "admin") {
      return res.status(403).json({ message: "해당 권한이 없습니다." });
    }

    const { email, nickname, point, grade } = req.body;

    const user = await userDb.findPkUser(Number(userId));

    if (!user) {
      return res.status(406).json({ message: "유저가 존재하지 않습니다." });
    }

    await userDb
      .AdminEditUserInfo(Number(userId), email, nickname, point, grade)
      .catch(() => {
        return res
          .status(400)
          .json({ message: "회원 정보를 수정하는데 실패했습니다." });
      });

    res.status(200).json({
      message: "해당 유저의 정보를 수정 했습니다.",
    });
  },

  removeUser: async (req, res) => {
    const { userId } = req.params;

    if (req.grade !== "admin") {
      return res.status(403).json({ message: "해당 권한이 없습니다." });
    }

    const user = await userDb.findPkUser(Number(userId));

    if (!user) {
      return res.status(406).json({ message: "유저가 존재하지 않습니다." });
    }

    await userDb.removeUser(Number(userId)).catch(() => {
      return res
        .status(400)
        .json({ message: "회원을 삭제 하는데 실패했습니다." });
    });

    res.status(200).json({ message: "해당 유저를 삭제했습니다." });
  },
};
