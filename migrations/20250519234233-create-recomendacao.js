'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recomendacao', {
      id_recomendacao: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_conteudo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:"Conteudo",
          key:"id_conteudo"
        }
      },
      id_material_externo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:"MaterialExterno",
          key:"id_material_externo"
        }
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
    await queryInterface.dropTable('Recomendacao');
  }
};