'use strict';

module.exports = {
 up: async (queryInterface, Sequelize) => {
    // Definindo as áreas de estudo para o ENEM e suas descrições
    const areas = [
      { nome: 'Matemática', descricao: 'Descrição para Matemática' },
      { nome: 'Português', descricao: 'Descrição para Português' },
      { nome: 'História', descricao: 'Descrição para História' },
      { nome: 'Geografia', descricao: 'Descrição para Geografia' },
      { nome: 'Ciências', descricao: 'Descrição para Ciências' },
      { nome: 'Artes', descricao: 'Descrição para Artes' },
      { nome: 'Informática', descricao: 'Descrição para Informática' },
      { nome: 'Química', descricao: 'Descrição para Química' },
      { nome: 'Física', descricao: 'Descrição para Física' },
      { nome: 'Biologia', descricao: 'Descrição para Biologia' },
      { nome: 'Filosofia', descricao: 'Descrição para Filosofia' },
      { nome: 'Sociologia', descricao: 'Descrição para Sociologia' },
      { nome: 'Educação Física', descricao: 'Descrição para Educação Física' },
      { nome: 'Língua Estrangeira', descricao: 'Descrição para Língua Estrangeira' }
    ];

    // Inserindo as áreas no banco de dados usando query raw
    for (const area of areas) {
      await queryInterface.sequelize.query(
        `INSERT INTO Area (nome, descricao, createdAt, updatedAt) VALUES ('${area.nome}', '${area.descricao}', NOW(), NOW())`
      );
    }
 },

 down: async (queryInterface, Sequelize) => {
    // Removendo as áreas inseridas pelo seed
    await queryInterface.sequelize.query(`DELETE FROM Area`);
    await queryInterface.sequelize.query(`ALTER TABLE Area AUTO_INCREMENT = 1`);

 }
};