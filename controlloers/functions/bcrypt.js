const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
  hash: async (password) => {
    return await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS)
    );
  },
  comparePw: async (password, hashPw) => {
    return await bcrypt.compare(password, hashPw);
  },
};
