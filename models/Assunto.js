const sequelize = require('sequelize');
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {
  class Assunto extends Model {
    static associate(models) {
      this.belongsTo(models.Assunto, { foreignKey: 'id_assunto', as: 'Ascendent'})
      this.hasMany(models.Assunto, { foreignKey: 'id_assunto', as: 'Descendents' })
      this.hasMany(models.Conteudo, { foreignKey: 'id_conteudo', as: 'Conteudo' })
    }
  }

  Assunto.init({
    id_assunto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id_assunto_ascendente: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Assunto',
          key: 'id_assunto',
          as: 'Ascendent'
        }
    }

  }, {
    sequelize,
    modelName: 'Assunto',
    tableName: 'Assunto'
  })

  return Assunto
}