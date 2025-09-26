const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {

    class Topico extends Model {
        static associate(models) {
            this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'Usuario' });
            this.belongsTo(models.Area, { foreignKey: 'id_area', as: 'Area' });
            this.belongsToMany(models.Questao, { through: 'QuestaoTopico', foreignKey: 'id_topico', as: 'Questao' });
        }
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
        id_area: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Area',
                key: 'id_area'
            }
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Usuario',
                key: 'id_usuario'
            }
        }
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