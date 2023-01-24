"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let ids = Array(20)
      .fill(0)
      .map((_, i) => i + 1);
    let infos = ids.map((id) => ({
      title: `유료글 테스트${id}`,
      content: `테스트${id}: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam, velit. Ipsum nesciunt mollitia dolor quae id quaerat, modi eius eos dolore odio quisquam maxime labore dolorem voluptatibus harum aliquid voluptatem.`,
      targetPoint: 3000,
      type: "Paid",
      userId: 1,
      activate: 1,
    }));
    await queryInterface.bulkInsert("Info", infos);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Info", null, {});
  },
};
