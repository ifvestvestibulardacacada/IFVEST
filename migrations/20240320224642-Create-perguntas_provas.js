'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('QuestaoSimulado', {
      id_questao_simulado: {
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
      id_simulado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Simulado',
          key: 'id_simulado'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('QuestaoSimulado');
  }
};
