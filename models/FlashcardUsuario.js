module.exports = (sequelize, DataTypes) => {
  const FlashcardUsuario = sequelize.define('FlashcardUsuario', {
    id_flashcard_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_flashcards: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visto_por_ultimo: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  }, {
    tableName: 'FlashcardUsuario',
    timestamps: false
  });

  FlashcardUsuario.associate = models => {
    FlashcardUsuario.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
    FlashcardUsuario.belongsTo(models.Flashcard, { foreignKey: 'id_flashcards' });
  };

  return FlashcardUsuario;
};
