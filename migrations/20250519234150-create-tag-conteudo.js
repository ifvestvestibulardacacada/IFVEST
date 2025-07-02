'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TagConteudo', {
      id_tag_conteudo: {
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
      id_palavrachave: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:"PalavraChave",
          key:"id_palavrachave"
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
    await queryInterface.dropTable('TagConteudo');
  }
};