const jwt = require("jsonwebtoken");
import { config } from "../../config";

module.exports = {
  // token으로 sign
  generateAccessToken: (id, grade) => {
    return jwt.sign({ id, grade }, config.jwt.secret_key, {
      expiresIn: config.jwt.expiresIn,
    });
  },
  generateRefreshToken: (id, grade) => {
    return jwt.sign({ id, grade }, config.jwt.secret_key, {
      expiresIn: config.jwt.expiresIn,
    });
  },
  // JWT 토큰을 쿠키로 전달
  // sendToken: (res, refreshToken) => {
  //   const cookieOptions = {
  //     httpOnly: true,
  //   };
  //   res.cookie('refreshToken', refreshToken, cookieOptions);
  // },
  // JWT 토큰 정보를 받아서 검증
};
