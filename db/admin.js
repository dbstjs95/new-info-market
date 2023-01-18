const Admin = require("../models/admin");

export async function findAdminByPK(adminId) {
  return await Admin.findOne({
    where: { id: adminId },
  });
}

export async function findAdmin(email) {
  return await Admin.findOne({
    where: {
      email,
    },
  });
}

export async function createAdmin(email, hashPw) {
  return await Admin.create({
    email,
    password: hashPw,
  });
}
