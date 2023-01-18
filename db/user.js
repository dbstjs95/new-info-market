const { User } = require("../models");

async function createUser(email, hashPw, nickname, phone) {
  return await User.create({
    email,
    password: hashPw,
    nickname,
    phone,
  });
}

async function findUsers(pages, limit) {
  return await User.findAndCountAll({
    order: [["createdAt", "desc"]],
    limit,
    offset: (pages - 1) * 10,
  });
}

async function findUser(email) {
  return await User.findOne({
    where: {
      email,
    },
  });
}

async function editUserEmail(userId, email) {
  return await User.update(
    {
      email,
    },
    {
      where: {
        id: userId,
      },
    }
  );
}

async function editUserNickname(userId, nickname) {
  return await User.update(
    {
      nickname,
    },
    {
      where: {
        id: userId,
      },
    }
  );
}
async function editUserPhone(userId, phone) {
  return await User.update(
    {
      phone,
    },
    {
      where: {
        id: userId,
      },
    }
  );
}
async function editUserPassword(userId, hashPw) {
  return await User.update(
    {
      password: hashPw,
    },
    {
      where: {
        id: userId,
      },
    }
  );
}

async function editUserInfo(userId, email, hashPw, nickname, phone) {
  return await User.update(
    {
      email,
      password: hashPw,
      nickname,
      phone,
    },
    {
      where: {
        id: userId,
      },
    }
  );
}
async function AdminEditUserInfo(userId, email, nickname, point, grade) {
  return await User.update(
    {
      email,
      nickname,
      point,
      grade,
    },
    {
      where: {
        id: userId,
      },
    }
  );
}

async function removeUser(userId) {
  return await User.destroy({
    where: {
      id: userId,
    },
  });
}

async function findPkUser(userId) {
  return await User.findOne({
    where: { id: userId },
  });
}

async function editUserPoint(userId, point) {
  return await User.update(
    { point },
    {
      where: {
        id: userId,
      },
    }
  );
}

async function checkNickname(nickname) {
  return await User.findOne({
    where: {
      nickname,
    },
  });
}

async function postImg(img, userId) {
  return await User.update(
    { img },
    {
      where: {
        id: userId,
      },
    }
  );
}

module.exports = {
  createUser,
  findUsers,
  findUser,
  editUserEmail,
  editUserNickname,
  editUserPhone,
  editUserPassword,
  editUserInfo,
  AdminEditUserInfo,
  removeUser,
  findPkUser,
  editUserPoint,
  checkNickname,
  postImg,
};
