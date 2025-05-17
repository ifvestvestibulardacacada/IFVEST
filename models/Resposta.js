const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resposta extends Model {
    static associate(models) {
      this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'Usuario' });
      this.belongsTo(models.Simulado, { foreignKey: 'id_simulado', as: 'Simulado' });
      this.belongsTo(models.Questao, { foreignKey: 'id_questao', as: 'Questao' });
      this.belongsTo(models.Opcao, { foreignKey: 'id_opcao', as: 'Opcao' }); 
    }
  }

  Resposta.init({
    id_resposta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    resposta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: DataTypes.ENUM({
      values: ['DISSERTATIVA', 'OBJETIVA'],
      allowNull: false
    }),
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_simulado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Resposta',
    tableName: 'Resposta'
  });

  return Resposta;
};
