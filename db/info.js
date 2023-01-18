const { Sequelize, Op, where } = require("sequelize");

const Reply = require("../models/reply");
const Info = require("../models/info");
const User = require("../models/user");

export async function getInfo(infoId) {
  return await Info.findOne({
    where: { id: infoId },
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "targetPoint",
      "type",
      "file",
      "totalViews",
      "totalLikes",
    ],
    include: [
      {
        model: User,
        attributes: [],
      },
      {
        model: Reply,
        attributes: ["id", "userid", "content", "createdAt"],
        include: [
          {
            model: User,
            attributes: ["nickname"],
          },
        ],
      },
    ],
  });
}

export async function getInfos() {
  return await Info.findAll({
    order: [["totalLikes", "desc"]],
    limit: 10,
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "updatedAt",
      "targetPoint",
      "activate",
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

export async function AdminGetInfo(pages, limit, activate) {
  return await Info.findAndCountAll({
    order: [["createdAt", "desc"]],
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
      "activate",
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
    where: {
      activate,
    },
  });
}

export async function getMyInfos(pages, limit, userId) {
  return await Info.findAndCountAll({
    order: [["createdAt", "desc"]],
    limit,
    offset: (pages - 1) * limit,
    where: {
      userId,
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
      "activate",
    ],
    include: [
      {
        model: User,
        attributes: [],
      },
    ],
  });
}

export async function createInfo(
  title,
  content,
  targetPoint,
  type,
  userId,
  activate,
  file
) {
  return await Info.create({
    title,
    content,
    targetPoint,
    type,
    userId,
    activate,
    file,
  });
}

export async function removeInfo(infoId) {
  return await Info.destroy({
    where: { id: infoId },
  });
}

export async function BronzeEditInfo(infoId, title, content, file) {
  return await Info.update(
    {
      title,
      content,
      file,
    },
    { where: { id: infoId } }
  );
}

export async function SGEditInfo(
  infoId,
  title,
  content,
  targetPoint,
  type,
  file
) {
  return await Info.update(
    {
      title,
      content,
      targetPoint,
      type,
      file,
    },
    { where: { id: infoId } }
  );
}

export async function viewsAdd(infoId, views) {
  return await Info.update(
    {
      totalViews: views + 1,
    },
    {
      where: {
        id: infoId,
      },
    }
  );
}

export async function LikesAdd(infoId, likes) {
  return await Info.update(
    {
      totalLikes: likes + 1,
    },
    {
      where: {
        id: infoId,
      },
    }
  );
}

export async function LikesSub(infoId, likes) {
  return await Info.update(
    {
      totalLikes: likes - 1,
    },
    {
      where: {
        id: infoId,
      },
    }
  );
}

export async function adminEditInfo(
  infoId,
  title,
  content,
  targetPoint,
  type,
  activate
) {
  return await Info.update(
    {
      title,
      content,
      targetPoint,
      type,
      activate,
    },
    {
      where: {
        id: infoId,
      },
    }
  );
}

export async function activateInfo(activate, infoId) {
  return await Info.update(
    {
      activate,
    },
    {
      where: {
        id: infoId,
      },
    }
  );
}

export async function editInfoFile(infoId, file) {
  return await Info.update(
    {
      file,
    },
    {
      where: {
        id: infoId,
      },
    }
  );
}

export async function findFreeInfo(pages, limit, like, cursor) {
  return await Info.findAndCountAll({
    order: [
      ["createdAt", "desc"],
      ["totalLikes", like],
    ],
    limit,
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "updatedAt",
      "targetPoint",
      "activate",
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
    where: {
      id: { [Op.lt]: cursor },

      type: "Free",
    },
  });
}

export async function findPaidInfo(pages, limit, like_type, activate, cursor) {
  return await Info.findAndCountAll({
    order: [
      ["createdAt", "desc"],
      ["totalLikes", like_type],
    ],
    limit,
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "updatedAt",
      "targetPoint",
      "activate",
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
    where: {
      id: { [Op.lt]: cursor },
      activate,
      type: "Paid",
    },
  });
}

export async function recentInfo(pages, limit, type) {
  return await Info.findAndCountAll({
    order: [["createdAt", "desc"]],
    limit,
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "updatedAt",
      "targetPoint",
      "activate",
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
    where: {
      type,
      activate: true,
    },
  });
}

export async function likeInfo(pages, limit, like, type) {
  return await Info.findAndCountAll({
    order: [["totalLikes", like]],
    limit,
    attributes: [
      "id",
      [Sequelize.col("User.nickname"), "nickname"],
      "title",
      "content",
      "userId",
      "createdAt",
      "updatedAt",
      "targetPoint",
      "activate",
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
    where: {
      type,
      activate: true,
    },
  });
}
