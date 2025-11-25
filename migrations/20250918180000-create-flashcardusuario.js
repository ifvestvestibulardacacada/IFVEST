module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FlashcardUsuario', {
      id_flashcard_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      id_flashcards: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Flashcard',
          key: 'id_flashcards',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      visto_por_ultimo: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FlashcardUsuario');
  }
};
