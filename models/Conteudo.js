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
      this.belongsToMany(models.PalavraChave, { through: 'TagConteudo', foreignKey: 'id_conteudo',otherKey: 'id_palavrachave', as: 'PalavraChave' });
      this.belongsToMany(models.MaterialExterno, { through: 'Recomendacao', foreignKey: 'id_conteudo',otherKey: 'id_material_externo', as: 'MaterialExterno' });
      this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'Usuario' });
      this.belongsTo(models.Topico, { foreignKey: 'id_conteudo', as: 'Topico' });
    }
  }
  Conteudo.init({
    id_conteudo: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
     nome: DataTypes.STRING,
    conteudo_markdown: DataTypes.TEXT,
    contagem_leituras: DataTypes.INTEGER,
    id_usuario: {
      type:DataTypes.INTEGER,
      references:{
        model:"Usuario",
        key:"id_usuario"
      }
    },
    id_topico: {
      type: DataTypes.INTEGER,
      references: {
        model: "Topico",
        key: "id_topico"
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Conteudo',
    tableName: 'Conteudo'
  });
  return Conteudo;
};