'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TagConteudo extends Model {
    static associate(models) {
      this.belongsTo(models.Conteudo, {
        foreignKey: 'id_conteudo',
        as: 'Conteudo'
      });
      this.belongsTo(models.PalavraChave, {
        foreignKey: 'id_palavrachave',
        as: 'PalavraChave'
      });
    }
  }

  TagConteudo.init({
    id_tag_conteudo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_conteudo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conteudo',
        key: 'id_conteudo'
      }
    },
    id_palavrachave: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PalavraChave',
        key: 'id_palavrachave'
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
    modelName: 'TagConteudo',
    tableName: 'TagConteudo',
    timestamps: true
  });

  return TagConteudo;
};