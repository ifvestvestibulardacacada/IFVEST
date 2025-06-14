const sequelize = require('sequelize');
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {
  class Questao extends Model {
    static associate(models) {
      this.belongsToMany(models.Topico, { through: 'QuestaoTopico', foreignKey: 'id_questao', as: 'Topico'});
      this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'Usuario' });
      this.belongsToMany(models.Simulado, { through: 'QuestaoSimulado', foreignKey: 'id_questao', as: 'Simulado' });
      this.hasMany(models.Opcao, { foreignKey: 'id_questao', as: 'Opcao' });
      this.hasMany(models.Resposta, { foreignKey: 'id_questao', as: 'Resposta' });
      this.belongsTo(models.Area, { foreignKey: 'id_area', as: 'Area' });
    }
  }

  Questao.init({
    id_questao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING
    },
    pergunta: {
      type: DataTypes.STRING
    },
    tipo: {
      type: DataTypes.ENUM({
        values: ['DISSERTATIVA', 'OBJETIVA'],
        allowNull: false
      })
    }

  }, {
    sequelize,
    modelName: 'Questao',
    tableName: 'Questao'
  })

  return Questao
}

// module.exports = (sequelize, DataTypes) => {
//     const Questões = sequelize.define('Questões', {
//       pergunta: DataTypes.TEXT,
//       titulo: DataTypes.TEXT,
//       tipo: DataTypes.ENUM({
//         values: ['DISSERTATIVA', 'OBJETIVA'],
//         allowNull: false
//       })
//     }, {
//       tableName: 'questoes'
//     });
  
//     Questões.associate = (models) => {
//       Questões.belongsToMany(models.Topico, { through: 'questoes_topicos', foreignKey: 'questaoId' });
//       Questões.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
//       Questões.belongsToMany(models.Simulados, { through: 'perguntas_provas', foreignKey: 'QuestõesId' });
//       Questões.hasMany(models.Opcao, { foreignKey: 'questao_id', as: 'Opcoes' });
//       Questões.hasMany(models.Resposta, { foreignKey: 'questaoId', as: 'Respostas' });
//        Questões.belongsTo(models.Area, {
//         foreignKey: 'areaId',
//         as: 'Area'
//       });
//     };     
//     return Questões;
//   };
  