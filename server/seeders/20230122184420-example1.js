"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let ids = Array(20)
      .fill(0)
      .map((_, i) => i + 1);
    let freeInfos = ids.map((id) => ({
      title: `무료글 테스트${id}`,
      content: `테스트${id}: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam, velit. Ipsum nesciunt mollitia dolor quae id quaerat, modi eius eos dolore odio quisquam maxime labore dolorem voluptatibus harum aliquid voluptatem.`,
      targetPoint: null,
      type: "Free",
      userId: 1,
      activate: 1,
      createdAt: `2023-01-19 ${id >= 10 ? id : "0" + id}:${10 + id}:25`,
      updatedAt: `2023-01-19 ${id >= 10 ? id : "0" + id}:${10 + id}:25`,
    }));
    let paidInfos = ids.map((id) => ({
      title: `유료글 테스트${id}`,
      content: `테스트${id}: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam, velit. Ipsum nesciunt mollitia dolor quae id quaerat, modi eius eos dolore odio quisquam maxime labore dolorem voluptatibus harum aliquid voluptatem.`,
      targetPoint: 3000,
      type: "Paid",
      userId: 1,
      activate: 1,
      createdAt: `2023-01-${id >= 10 ? id : "0" + id} ${
        id >= 10 ? id : "0" + id
      }:02:35`,
      updatedAt: `2023-01-${id >= 10 ? id : "0" + id} ${
        id >= 10 ? id : "0" + id
      }:02:35`,
    }));
    await queryInterface.bulkInsert("User", [
      {
        id: 1,
        email: "choji95@naver.com",
        password:
          "$2b$10$PIidlMJJwlII53f6vcDK8.hiB/ovu7pMAbkMHSQepwhoeal2MJybS",
        grade: "Silver",
        nickname: "예삐",
        phone: "010-7234-1377",
        createdAt: "2022-08-11 16:57:43",
      },
    ]);
    await queryInterface.bulkInsert("Info", [...freeInfos, ...paidInfos]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Info", null, {});
    await queryInterface.bulkDelete("User", null, {});
  },
};
