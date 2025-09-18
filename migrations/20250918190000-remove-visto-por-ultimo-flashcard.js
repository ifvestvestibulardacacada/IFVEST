'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Flashcard', 'visto_por_ultimo');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Flashcard', 'visto_por_ultimo', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
