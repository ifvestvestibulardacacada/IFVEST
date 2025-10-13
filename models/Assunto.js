const sequelize = require('sequelize');
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {
  class Assunto extends Model {
    static associate(models) {
      this.belongsTo(models.Assunto, { foreignKey: 'id_assunto_ascendente', as: 'Ascendent'})
      this.hasMany(models.Assunto, { foreignKey: 'id_assunto_ascendente', as: 'Descendents' })
      this.hasMany(models.Conteudo, { foreignKey: 'id_assunto', as: 'Conteudo' })
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
      allowNull: false,
      unique: true
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
          key: 'id_assunto'
        }
    }

  }, {
    sequelize,
    modelName: 'Assunto',
    tableName: 'Assunto'
  })

  return Assunto
}