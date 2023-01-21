const router = require("express").Router();
require("dotenv").config();
const pointControllers = require("../controlloers/point");
const auth = require("../middlewares/auth");

router.get("/getToken", auth.me, pointControllers.getToken);

router.post("/approve", auth.me, pointControllers.approve);

router.post("/cancel", pointControllers.cancel);

module.exports = router;
