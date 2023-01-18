const searchDb = require("../db/search");

module.exports = {
  // 무한 스크롤
  get: async (req, res) => {
    const { search_type, info_type, pages, limit } = req.query;

    if (search_type === "title") {
      const { title } = req.query;

      if (!title) {
        return res.status(400).json({ message: "제목을 입력해 주세요." });
      }

      if (info_type === "All") {
        const findInfoBy = await searchDb.searchAllTitle(
          String(title),
          Number(pages),
          Number(limit)
        );

        if (findInfoBy.count === 0) {
          return res.status(406).json({ message: "해당 게시물이 없습니다." });
        }

        return res
          .status(200)
          .json({ info: findInfoBy, message: "해당 게시물을 불러왔습니다." });
      } else {
        const findInfoBy = await searchDb.searchByTitle(
          String(title),
          Number(pages),
          Number(limit),
          String(info_type)
        );

        if (findInfoBy.count === 0) {
          return res.status(406).json({ message: "해당 게시물이 없습니다." });
        }

        return res
          .status(200)
          .json({ info: findInfoBy, message: "해당 게시물을 불러왔습니다." });
      }
    } else if (search_type === "content") {
      const { content } = req.query;

      if (!content) {
        return res.status(400).json({ message: "내용을 입력해 주세요." });
      }

      if (info_type === "All") {
        const findInfoBy = await searchDb.searchAllContent(
          String(content),
          Number(pages),
          Number(limit)
        );

        if (findInfoBy.count === 0) {
          return res.status(406).json({ message: "해당 게시물이 없습니다." });
        }

        return res
          .status(200)
          .json({ info: findInfoBy, message: "해당 게시물을 불러왔습니다." });
      } else {
        const findInfoBy = await searchDb.searchByContent(
          String(content),
          Number(pages),
          Number(limit),
          String(info_type)
        );

        if (findInfoBy.count === 0) {
          return res.status(406).json({ message: "해당 게시물이 없습니다." });
        }

        return res
          .status(200)
          .json({ info: findInfoBy, message: "해당 게시물을 불러왔습니다." });
      }
    } else if (search_type === "nickname") {
      // 닉네임 검색 수정 필요. 몇개 있는지는 검색이 되지만 내용이 검색 안됨
      const { nickname } = req.query;
      if (!nickname) {
        return res.status(400).json({ message: "내용을 입력해 주세요." });
      }

      if (info_type === "All") {
        const findInfoBy = await searchDb.searchAllNick(
          String(nickname),
          Number(pages),
          Number(limit)
        );

        if (findInfoBy.count === 0) {
          return res.status(406).json({ message: "해당 게시물이 없습니다." });
        }

        return res
          .status(200)
          .json({ info: findInfoBy, message: "해당 게시물을 불러왔습니다." });
      } else {
        const findInfoBy = await searchDb.searchByNick(
          String(nickname),
          Number(pages),
          Number(limit),
          String(info_type)
        );

        if (findInfoBy.count === 0) {
          return res.status(406).json({ message: "해당 게시물이 없습니다." });
        }

        return res
          .status(200)
          .json({ info: findInfoBy, message: "해당 게시물을 불러왔습니다." });
      }
    }
  },
};
