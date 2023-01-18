const { Sequelize, Op } = require("sequelize");

const Info = require("../models/info");
const User = require("../models/user");

export async function searchByTitle(titles, pages, limit, info_type) {
  return await Info.findAndCountAll({
    order: [["createdAt", "desc"]],
    where: {
      title: {
        [Op.like]: "%" + titles + "%",
      },
      type: info_type,
      activate: true,
    },
    limit,
    offset: (pages - 1) * limit,
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "updatedAt",
      "targetPoint",
      "type",
      "totalViews",
      "totalLikes",
    ],
    include: [
      {
        model: User,
        attributes: [],
      },
    ],
  });
}

export async function searchByContent(content, pages, limit, info_type) {
  return await Info.findAndCountAll({
    order: [["createdAt", "desc"]],
    where: {
      content: {
        [Op.like]: "%" + content + "%",
      },
      type: info_type,
      activate: true,
    },
    limit,
    offset: (pages - 1) * limit,
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "updatedAt",
      "targetPoint",
      "type",
      "totalViews",
      "totalLikes",
    ],
    include: [
      {
        model: User,
        attributes: [],
      },
    ],
  });
}

export async function searchAllTitle(titles, pages, limit) {
  return await Info.findAndCountAll({
    order: [["createdAt", "desc"]],
    where: {
      title: {
        [Op.like]: "%" + titles + "%",
      },
      activate: true,
    },
    limit,
    offset: (pages - 1) * limit,
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "updatedAt",
      "targetPoint",
      "type",
      "totalViews",
      "totalLikes",
    ],
    include: [
      {
        model: User,
        attributes: [],
      },
    ],
  });
}

export async function searchAllContent(content, pages, limit) {
  return await Info.findAndCountAll({
    order: [["createdAt", "desc"]],
    where: {
      content: {
        [Op.like]: "%" + content + "%",
      },
      activate: true,
    },
    limit,
    offset: (pages - 1) * limit,
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "updatedAt",
      "targetPoint",
      "type",
      "totalViews",
      "totalLikes",
    ],
    include: [
      {
        model: User,
        attributes: [],
      },
    ],
  });
}

export async function searchByNick(Nickname, pages, limit, info_type) {
  return await Info.findAndCountAll({
    order: [["createdAt", "desc"]],
    where: {
      type: info_type,
      activate: true,
    },
    limit,
    offset: (pages - 1) * limit,
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "updatedAt",
      "targetPoint",
      "type",
      "totalViews",
      "totalLikes",
    ],
    include: [
      {
        model: User,
        attributes: [],
        where: {
          nickname: {
            [Op.like]: "%" + Nickname + "%",
          },
        },
      },
    ],
  });
}

export async function searchAllNick(nickname, pages, limit) {
  return await Info.findAndCountAll({
    order: [["createdAt", "desc"]],
    limit,
    offset: (pages - 1) * limit,
    where: {
      activate: true,
    },
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "updatedAt",
      "targetPoint",
      "type",
      "totalViews",
      "totalLikes",
    ],
    include: [
      {
        model: User,
        attributes: [],
        where: {
          nickname: {
            [Op.like]: "%" + nickname + "%",
          },
        },
      },
    ],
  });
}
