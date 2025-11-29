'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Placar', {

      id_placar: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      acertos: {
        type: Sequelize.INTEGER
      },
      total_questoes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      porcentagem: {
        type: Sequelize.FLOAT 
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Placar');
  }
};