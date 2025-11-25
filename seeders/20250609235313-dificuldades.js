'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const dificuldades = [
      { id_dificuldade: 1, nivel: 'Fácil' },
      { id_dificuldade: 2, nivel: 'Médio' },
      { id_dificuldade: 3, nivel: 'Difícil' }
    ];
    for (const dificuldade of dificuldades) {
      await queryInterface.sequelize.query(
        `INSERT INTO Dificuldade (id_dificuldade, nivel) VALUES (${dificuldade.id_dificuldade}, '${dificuldade.nivel}')`
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DELETE FROM Dificuldade');
  }
};
