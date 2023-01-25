const { Sequelize, Op, fn, col } = require("sequelize");

const { Reply, Info, User } = require("../models");

async function getInfo(infoId) {
  return await Info.findOne({
    where: { id: infoId },
    attributes: {
      include: [
        "id",
        [Sequelize.col("User.nickname"), "nickname"],
        "title",
        "content",
        "userId",
        [fn("DATE_FORMAT", col("User.createdAt"), "%Y-%m-%d"), "createdAt"],
        "targetPoint",
        "type",
        "file",
        "totalViews",
        "totalLikes",
      ],
    },
    include: [
      {
        model: User,
        attributes: [],
      },
      {
        model: Reply,
        attributes: {
          include: [
            "id",
            "userid",
            "content",
            [
              fn("DATE_FORMAT", col("Replies.createdAt"), "%Y-%m-%d %H:%i:%s"),
              "createdAt",
            ],
          ],
        },
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

async function getInfos() {
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

async function AdminGetInfo(pages, limit, activate) {
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

async function getMyInfos(pages, limit, userId) {
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
      [
        fn("DATE_FORMAT", col("Info.createdAt"), "%Y-%m-%d %H:%i:%s"),
        "createdAt",
      ],
      [
        fn("DATE_FORMAT", col("Info.updatedAt"), "%Y-%m-%d %H:%i:%s"),
        "updatedAt",
      ],
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

async function createInfo(
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

async function removeInfo(infoId) {
  return await Info.destroy({
    where: { id: infoId },
  });
}

async function BronzeEditInfo(infoId, title, content, file) {
  return await Info.update(
    {
      title,
      content,
      file,
    },
    { where: { id: infoId } }
  );
}

async function SGEditInfo(infoId, title, content, targetPoint, type, file) {
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

async function viewsAdd(infoId, views) {
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

async function LikesAdd(infoId, likes) {
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

async function LikesSub(infoId, likes) {
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

async function adminEditInfo(
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

async function activateInfo(activate, infoId) {
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

async function editInfoFile(infoId, file) {
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

async function findFreeInfo(pages, limit, like_type, activate, cursor) {
  let customOffset = like_type ? (pages - 1) * 10 : 0;
  let customOrder = like_type
    ? [
        ["totalLikes", "desc"],
        ["createdAt", "asc"],
      ]
    : [
        ["createdAt", "desc"],
        ["id", "desc"],
      ];

  let customWhere = like_type
    ? {
        type: "Free",
        activate,
      }
    : {
        id: { [Op.lt]: cursor },
        type: "Free",
        activate,
      };

  return await Info.findAndCountAll({
    offset: customOffset,
    order: customOrder,
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
    where: customWhere,
  });
}

async function findPaidInfo(pages, limit, like_type, activate, cursor) {
  let customOffset = like_type ? (pages - 1) * 10 : 0;
  let customOrder = like_type
    ? [
        ["totalLikes", "desc"],
        ["createdAt", "asc"],
      ]
    : [
        ["createdAt", "desc"],
        ["id", "desc"],
      ];

  let customWhere = like_type
    ? {
        type: "Paid",
        activate,
      }
    : {
        id: { [Op.lt]: cursor },
        type: "Paid",
        activate,
      };

  return await Info.findAndCountAll({
    offset: customOffset,
    order: customOrder,
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
    where: customWhere,
  });
}

async function recentInfo(pages, limit, type) {
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

async function likeInfo(pages, limit, like, type) {
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

module.exports = {
  getInfo,
  getInfos,
  AdminGetInfo,
  getMyInfos,
  createInfo,
  removeInfo,
  BronzeEditInfo,
  SGEditInfo,
  viewsAdd,
  LikesAdd,
  LikesSub,
  adminEditInfo,
  activateInfo,
  editInfoFile,
  findFreeInfo,
  findPaidInfo,
  recentInfo,
  likeInfo,
};
