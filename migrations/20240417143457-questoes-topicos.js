'use strict';

module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('QuestaoTopico', {
      id_questao_topico: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_questao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Questao',
          key: 'id_questao'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_topico: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Topico',
          key: 'id_topico'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
 },

 down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('QuestaoTopico');
 }
};