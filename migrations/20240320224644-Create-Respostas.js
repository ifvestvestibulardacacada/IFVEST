'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Resposta', {
      id_resposta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      resposta: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM('DISSERTATIVA', 'OBJETIVA'),
        allowNull: false,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario', 
          key: 'id_usuario',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      id_questao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Questao', // Certifique-se de que o nome do modelo esteja correto
          key: 'id_questao',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_opcao: {
        type: Sequelize.INTEGER,
        allowNull: true, // Torna o campo opcional
        references: {
          model: 'Opcao', // Certifique-se de que o nome do modelo esteja correto
          key: 'id_opcao',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Resposta');
  },
};
