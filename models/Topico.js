const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {

    class Topico extends Model {
        static associate(models) {

  this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'Usuario' });
  this.belongsTo(models.Topico, { foreignKey: 'id_topico', as: 'Topico' });
this.belongsToMany(models.Questao, { through: 'QuestaoTopico', foreignKey: 'id_topico', as: 'Questao' });}
    }

    Topico.init({
        id_topico: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Topico',
        tableName: 'Topico',
    });

    return Topico;
}


// module.exports = (sequelize, DataTypes) => {
//   const Topico = sequelize.define('Topico', {
//     materia: DataTypes.STRING,
//     areaId: DataTypes.INTEGER,
//   }, {
//     tableName: 'topicos'
//   });

//   Topico.associate = (models) => {
//     Topico.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
//     Topico.belongsTo(models.Area,  
//       {foreignKey: 'areaId'},);

//     Topico.belongsToMany(models.Questões, { through: 'questoes_topicos', foreignKey: 'topicoId' });

//   };



//   return Topico;
// };