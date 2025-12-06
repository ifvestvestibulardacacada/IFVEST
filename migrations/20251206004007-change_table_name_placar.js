'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Renomeia a tabela de "Placars" → "Placar"
    await queryInterface.renameTable('Placars', 'Placar');


 
  },

  async down(queryInterface, Sequelize) {
    // Reverte: volta o nome da tabela para "Placars"
    await queryInterface.renameTable('Placar', 'Placars');
  }
};