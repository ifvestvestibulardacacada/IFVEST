'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Flashcard', {
      id_flashcards: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pergunta: { type: Sequelize.TEXT },
      resposta: { type: Sequelize.TEXT },
      id_area: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'Area',
          key: 'id_area'
        }
       },
      id_topico: { 
        type: Sequelize.INTEGER, 
        references:{
          model: 'Topico',
          key: 'id_topico'
        } },
      id_dificuldade: { 
        type: Sequelize.INTEGER, 
        references:{
          model: 'Dificuldade',
          key: 'id_dificuldade'
        } },
      visto_por_ultimo: {
        type: Sequelize.DATE,
        allowNull: true
      },
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
    await queryInterface.dropTable('Flashcard');
  }
};
