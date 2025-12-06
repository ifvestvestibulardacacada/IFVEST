'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'Placars';

    // ------------------------------------------------------------------
    // 1. Remove autoIncrement + primaryKey do campo "nome"
    // ------------------------------------------------------------------
    await queryInterface.changeColumn(tableName, 'nome', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
    });

    // ------------------------------------------------------------------
    // 2. Remove a primary key atual (no MySQL o nome não importa, só dropamos)
    // ------------------------------------------------------------------
    await queryInterface.removeConstraint(tableName, 'PRIMARY', {
      type: 'primary key',
    }).catch(() => {
      // Em algumas versões o Sequelize já tenta remover com nome genérico
      return queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP PRIMARY KEY`);
    });

    // ------------------------------------------------------------------
    // 3. Adiciona a nova PK correta: id_placar
    // ------------------------------------------------------------------
    await queryInterface.addColumn(tableName, 'id_placar', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    });

    // ------------------------------------------------------------------
    // 4. Converte o campo "nome" para STRING (o que você queria desde o início)
    // ------------------------------------------------------------------
    await queryInterface.changeColumn(tableName, 'nome', {
      type: Sequelize.STRING(255), // ou só Sequelize.STRING
      allowNull: false,
    });

    // ------------------------------------------------------------------
    // 5. (Opcional) Garante que o auto_increment comece do próximo valor correto
    // ------------------------------------------------------------------
    await queryInterface.sequelize.query(`
      ALTER TABLE \`${tableName}\` AUTO_INCREMENT = 1
    `);
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'Placars';

    // Remove a coluna que adicionamos
    await queryInterface.removeColumn(tableName, 'id_placar');

    // Volta o campo nome a ser INTEGER + PK + autoIncrement (rollback)
    await queryInterface.changeColumn(tableName, 'nome', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });
  }
};