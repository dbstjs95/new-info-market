const jwt = require("jsonwebtoken");
require("dotenv").config();

const userDb = require("../db/user");
const adminDb = require("../db/admin");

const jwtToken = require("../controlloers/functions/jwtToken");

module.exports = {
  me: async (req, res, next) => {
    const isAuthCheck = req.get("IsAuthCheck");

    let token;
    const authHeader = req.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res
        .status(400)
        .json({ message: "access Token이 존재하지 않습니다." });
    }

    await jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
      if (error) {
        return res.status(400).json({ message: "인증에 실패했습니다." });
      }

      // id, grade
      if (decoded.grade === "admin") {
        const admin = await adminDb.findAdminByPK(decoded.id);
        if (!admin) {
          return res.status(400).json({ message: "유저가 존재하지 않습니다." });
        }

        if (!isAuthCheck) {
          req.userId = admin.id; // 다른 유저가 내 게시물 삭제하는 것을 방지하기 위해 검증하기 위해
          req.token = token;
          req.grade = admin.grade; // 등급이 안되는데 상업적 게시물 올릴려고 할 때 검증하기 위해
          return next();
        } else {
          const { id, point, grade, nickname, phone } = admin;
          return res.status(200).json({
            id,
            point,
            grade,
            nickname,
            phone,
            message: "인증된 관리자입니다.",
          });
        }
      } else {
        const user = await userDb.findPkUser(decoded.id);

        if (!user) {
          return res.status(400).json({ message: "유저가 존재하지 않습니다." });
        }

        if (!isAuthCheck) {
          req.userId = user.id; // 다른 유저가 내 게시물 삭제하는 것을 방지하기 위해 검증하기 위해
          req.token = token;
          req.grade = user.grade; // 등급이 안되는데 상업적 게시물 올릴려고 할 때 검증하기 위해

          return next();
        } else {
          const { id, point, grade, nickname, phone } = user;
          return res.status(200).json({
            id,
            point,
            grade,
            nickname,
            phone,
            message: "인증된 사용자입니다.",
          });
        }
      }
    });
  },
  newAcc: (req, res, next) => {
    const refreshToken = req.headers.cookie;

    if (!refreshToken) {
      return res.status(400).json({ message: "refresh token이 없습니다." });
    } else if (refreshToken === "refreshtoken= ") {
      return res.status(400).json({
        message: "refresh token이 없습니다. 다시 로그인 해주세요.",
      });
    }

    const getToken = refreshToken.split("=")[1].split(";")[0];

    jwt.verify(getToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(400).json({ message: "인증에 실패했습니다." });
      }

      const user = await userDb.findPkUser(decoded.id);

      if (!user) {
        return res.status(400).json({ message: "유저가 존재하지 않습니다." });
      }

      const { id, grade } = user;
      const accessToken = await jwtToken.generateAccessToken(id, grade);

      return res.status(200).json({
        accToken: accessToken,
        message: "accessToken을 새로 발급 받았습니다.",
      });
    });
  },
};
