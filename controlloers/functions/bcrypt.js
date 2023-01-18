const bcrypt = require("bcrypt");
import { config } from "../../config";

module.exports = {
  hash: async (password) => {
    return await bcrypt.hash(password, parseInt(config.bcrypt.saltRounds));
  },
  comparePw: async (password, hashPw) => {
    return await bcrypt.compare(password, hashPw);
  },
};
