"use strict";

module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Opcao', {
      id_opcao: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_questao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Questao',
          key: 'id_questao'
        }
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      alternativa: {
        type: Sequelize.ENUM({
          values: ['A', 'B', 'C', 'D', 'E']
        }),
        allowNull: true,
        defaultValue: 'A'
      },
      correta: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('Opcao');
 }
};
