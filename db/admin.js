const { Admin } = require("../models");

async function findAdminByPK(adminId) {
  return await Admin.findOne({
    where: { id: adminId },
  });
}

async function findAdmin(email) {
  return await Admin.findOne({
    where: {
      email,
    },
  });
}

async function createAdmin(email, hashPw) {
  return await Admin.create({
    email,
    password: hashPw,
  });
}

module.exports = { findAdminByPK, findAdmin, createAdmin };
