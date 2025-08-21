
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
    visto_por_ultimo: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  }, {
    tableName: 'Flashcard'
  });

  Flashcard.associate = models => {
    Flashcard.belongsTo(models.Area, { foreignKey: 'id_area' });
    Flashcard.belongsTo(models.Topico, { foreignKey: 'id_topico' });
    Flashcard.belongsTo(models.Dificuldade, { foreignKey: 'id_dificuldade' });
  };

  return Flashcard;
};
