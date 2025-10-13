const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Simulado extends Model {
        static associate(models) {
          this.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'Usuario' });
          this.hasMany(models.Resposta, {
            foreignKey: 'id_simulado',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          });
          this.belongsToMany(models.Questao, { through: 'QuestaoSimulado', foreignKey: 'id_simulado', as: 'Questao' });
        }
    }

    Simulado.init({
        id_simulado: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tipo: {
          type: DataTypes.ENUM('DISSERTATIVO', 'OBJETIVO', 'ALEATORIO'),
          allowNull: true
        },
    }, {
        sequelize,
        modelName: 'Simulado',
        tableName: 'Simulado',
    });

    return Simulado;
}


// 'use strict';

// module.exports = (sequelize, DataTypes) => {
//   const Simulados = sequelize.define('Simulados', {
//     titulo: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     descricao: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     tipo: {
//       type: DataTypes.INTEGER,
//       allowNull: true
//     }
//   }, {
//     tableName: 'simulados'
//   });

//   Simulados.associate = (models) => {
//     // Associação com o modelo Usuario
//     Simulados.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    
//     Simulados.hasMany(models.Resposta, {
//       foreignKey: 'simuladoId',
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE',
//     });
//     // Associação com o modelo PerguntasProvas (um questionário tem várias perguntas)
//     Simulados.belongsToMany(models.Questões, { through: 'perguntas_provas', foreignKey: 'simuladoId' });

//   };
  

//   return Simulados;
// };
