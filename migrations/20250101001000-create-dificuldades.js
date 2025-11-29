'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Dificuldade', {
      id_dificuldade: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nivel: { type: Sequelize.STRING, allowNull: false, },
      createdAt:{
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt:{
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
        }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Dificuldade');
  }
};
