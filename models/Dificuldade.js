const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Dificuldade extends Model {
    static associate(models) {
      this.hasMany(models.Flashcard, { foreignKey: 'id_dificuldade', as: 'Flashcards' });
    }
  }

  Dificuldade.init({
    id_dificuldade: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nivel: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
        sequelize,
        modelName: 'Dificuldade',
        tableName: 'Dificuldade',
    });

    return Dificuldade;
}


// module.exports = (sequelize, DataTypes) => {
//   const Dificuldade = sequelize.define('Dificuldade', {
//     nivel: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     }
//   }, {
//     tableName: 'dificuldades'  // 👈 define o nome real da tabela
//   });

//   Dificuldade.associate = models => {
//     Dificuldade.hasMany(models.Flashcard);
//   };

//   return Dificuldade;
// };
