const router = require("express").Router();
require("dotenv").config();
const searchControllers = require("../controlloers/search");

router.get("/", searchControllers.get);

module.exports = router;
