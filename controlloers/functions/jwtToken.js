const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  // token으로 sign
  generateAccessToken: (id, grade) => {
    return jwt.sign({ id, grade }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  },
  generateRefreshToken: (id, grade) => {
    return jwt.sign({ id, grade }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
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
