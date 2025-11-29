'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Placar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Placar.belongsTo(models.Usuario, {
      // foreignKey: 'id_usuario' // A coluna que faz essa ligação
      // });
    }

  }
  Placar.init({
    id_placar: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    nome: DataTypes.STRING,
    acertos: DataTypes.INTEGER,
    total_questoes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    porcentagem: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Placar',
    tableName: 'Placar',
  });
  return Placar;
}; 