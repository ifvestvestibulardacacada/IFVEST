'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Questao', {
      id_questao: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      titulo: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      pergunta: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tipo: {
        type: Sequelize.ENUM({
          values: ['DISSERTATIVA', 'OBJETIVA']
        }),
        allowNull: false,
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
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_area: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Area', // Nome da tabela referenciada
          key: 'id_area'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // id_vestibular: {},
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Questao');
  }
};
