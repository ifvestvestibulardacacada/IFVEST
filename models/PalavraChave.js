'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PalavraChave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Conteudo, { through: 'TagConteudo', foreignKey: 'id_palavrachave',otherKey: 'id_conteudo', as: 'Conteudo' });
    }
  }
  PalavraChave.init({
    id_palavrachave: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    palavrachave: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PalavraChave',
    tableName: 'PalavraChave'
  });
  return PalavraChave;
};