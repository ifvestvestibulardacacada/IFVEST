'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Assunto', [
      {
        id_assunto: 8,
        nome: 'Matemática Básica',
        descricao: 'Operações fundamentais, frações, razões e proporções.',
        id_assunto_ascendente: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 9,
        nome: 'Geometria',
        descricao: 'Polígonos, áreas, volume, trigonometria.',
        id_assunto_ascendente: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 10,
        nome: 'Funções',
        descricao: 'Funções afim, quadrática, exponencial e logarítmica.',
        id_assunto_ascendente: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 11,
        nome: 'Probabilidade e Estatística',
        descricao: 'Análise combinatória, distribuições e interpretação gráfica.',
        id_assunto_ascendente: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 12,
        nome: 'Física Mecânica',
        descricao: 'Cinemática, dinâmica, leis de Newton.',
        id_assunto_ascendente: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 13,
        nome: 'Ondulatória',
        descricao: 'Movimentos ondulatórios, som, óptica.',
        id_assunto_ascendente: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 14,
        nome: 'Eletricidade',
        descricao: 'Eletrodinâmica, eletrostática, circuitos.',
        id_assunto_ascendente: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 15,
        nome: 'Química Geral',
        descricao: 'Átomos, ligações químicas, tabela periódica.',
        id_assunto_ascendente: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 16,
        nome: 'Química Orgânica',
        descricao: 'Funções orgânicas, reações, isomeria.',
        id_assunto_ascendente: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 17,
        nome: 'Química Físico-Química',
        descricao: 'Termoquímica, cinética, equilíbrio químico.',
        id_assunto_ascendente: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 18,
        nome: 'Biologia Celular',
        descricao: 'Organelas, ciclo celular, bioquímica básica.',
        id_assunto_ascendente: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 19,
        nome: 'Genética',
        descricao: 'Leis de Mendel, mutações, biotecnologia.',
        id_assunto_ascendente: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 20,
        nome: 'Ecologia',
        descricao: 'Relações ecológicas, ciclos biogeoquímicos, impactos ambientais.',
        id_assunto_ascendente: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 21,
        nome: 'História do Brasil',
        descricao: 'Colônia, Império, República.',
        id_assunto_ascendente: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_assunto: 22,
        nome: 'História Geral',
        descricao: 'Idade Média, Moderna e Contemporânea.',
        id_assunto_ascendente: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Assunto', null, {})
  }
}
