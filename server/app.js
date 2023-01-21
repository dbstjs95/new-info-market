const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const indexRouter = require("./routes");

const { sequelize } = require("./models");

const PORT = process.env.PORT || 80;

const app = express();

sequelize
  .sync()
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    preflightContinue: true,
    // 출처 허용 옵션
    origin: ["http://localhost:3000"],
    methods: "GET,PUT,POST,OPTIONS,DELETE,HEAD",
    // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근(credentials 스펠링 주의!!!!)
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/", indexRouter);

app.get("/", async (req, res) => {
  console.log("서버 연결 성공");
  res.send("Welcome!");
});

// http 통신
app.listen(PORT, () => {
  console.log("HTTP server listening on port " + PORT);
});
