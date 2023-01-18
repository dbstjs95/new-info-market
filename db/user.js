const User = require("../models/user");

export async function createUser(email, hashPw, nickname, phone) {
  return await User.create({
    email,
    password: hashPw,
    nickname,
    phone,
  });
}

export async function findUsers(pages, limit) {
  return await User.findAndCountAll({
    order: [["createdAt", "desc"]],
    limit,
    offset: (pages - 1) * 10,
  });
}

export async function findUser(email) {
  return await User.findOne({
    where: {
      email,
    },
  });
}

export async function editUserEmail(userId, email) {
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

export async function editUserNickname(userId, nickname) {
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
export async function editUserPhone(userId, phone) {
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
export async function editUserPassword(userId, hashPw) {
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

export async function editUserInfo(userId, email, hashPw, nickname, phone) {
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
export async function AdminEditUserInfo(userId, email, nickname, point, grade) {
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

export async function removeUser(userId) {
  return await User.destroy({
    where: {
      id: userId,
    },
  });
}

export async function findPkUser(userId) {
  return await User.findOne({
    where: { id: userId },
  });
}

export async function editUserPoint(userId, point) {
  return await User.update(
    { point },
    {
      where: {
        id: userId,
      },
    }
  );
}

export async function checkNickname(nickname) {
  return await User.findOne({
    where: {
      nickname,
    },
  });
}

export async function postImg(img, userId) {
  return await User.update(
    { img },
    {
      where: {
        id: userId,
      },
    }
  );
}
