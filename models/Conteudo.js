'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conteudo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.PalavraChave, { through: 'TagConteudo', foreignKey: 'id_conteudo', as: 'PalavrasChave' });
      this.belongsToMany(models.MaterialExterno, { through: 'Recomendacao', foreignKey: 'id_conteudo', as: 'MaterialExterno' });
    }
  }
  Conteudo.init({
    id_conteudo: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    conteudo_markdown: DataTypes.TEXT,
    contagem_leituras: DataTypes.INTEGER,
    id_usuario: {
      type:DataTypes.INTEGER,
      references:{
        model:"Usuario",
        key:"id_usuario"
      }
    }
  }, {
    sequelize,
    modelName: 'Conteudo',
  });
  return Conteudo;
};