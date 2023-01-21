const router = require("express").Router();
require("dotenv").config();
const authControllers = require("../controlloers/auth");
const authMe = require("../middlewares/auth");
// const validation = require('../middlewares/validator');
// import { body } from 'express-validator';

// 로그인
router.post("/login", authControllers.login);
// 로그아웃
router.post("/logout", authMe.me, authControllers.logout);
// 회원가입
router.post("/signup", authControllers.signup);
// router.post(
//   '/signup',
//   [
//     body('email').exists().isEmail().trim().bail(),
//     body('password')
//       .exists()
//       .isLength({ min: 8, max: 20 })
//       .trim()
//       .custom((value) => {
//         const regexPassword =
//           /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#\$%\^&\*]).{8,}$/;
//         const isNotValidPassword = !regexPassword.test(value);
//         if (isNotValidPassword) {
//           return Promise.reject(
//             '비밀번호에는 반드시 특수문자가 포함 되어야 합니다.',
//           );
//         }
//       })
//       .bail(), // 최소 영문, 숫자
//     body('nickname').exists().isLength({ min: 3, max: 20 }).trim().bail(),
//     body('phone').exists().bail(),
//     validation,
//   ],
//   authControllers.signup,
// );

// 회원탈퇴
router.delete("/:userId", authMe.me, authControllers.remove);

router.post("/newtoken", authMe.newAcc);

module.exports = router;
