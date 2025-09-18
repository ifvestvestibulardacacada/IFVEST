
module.exports = (sequelize, DataTypes) => {
  const Flashcard = sequelize.define('Flashcard', {
    id_flashcards: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    pergunta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    resposta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'Flashcard'
  });

  Flashcard.associate = models => {
    Flashcard.belongsTo(models.Area, { foreignKey: 'id_area' });
    Flashcard.belongsTo(models.Topico, { foreignKey: 'id_topico' });
    Flashcard.belongsTo(models.Dificuldade, { foreignKey: 'id_dificuldade' });

    // Associação com FlashcardUsuario
    Flashcard.hasMany(models.FlashcardUsuario, {
      foreignKey: 'id_flashcards',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Flashcard.belongsToMany(models.Usuario, {
      through: models.FlashcardUsuario,
      foreignKey: 'id_flashcards',
      otherKey: 'id_usuario',
      as: 'usuarios',
    });
  };

  return Flashcard;
};
