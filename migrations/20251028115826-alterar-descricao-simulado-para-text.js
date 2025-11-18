'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Simulado', 'descricao', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Simulado', 'descricao', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};