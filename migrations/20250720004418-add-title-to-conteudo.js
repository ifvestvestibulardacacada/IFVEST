'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding the 'titulo' column to the 'Conteudo' table
    await queryInterface.addColumn('Conteudo', 'titulo', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Removing the 'titulo' column in case of rollback
    await queryInterface.removeColumn('Conteudo', 'titulo');
  },
};