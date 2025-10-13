const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {

    class Usuario extends Model {
        static associate(models) {
          this.hasMany(models.Questao, {
            foreignKey: 'id_usuario',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          });
      
          // Associação com Respostas
          this.hasMany(models.Resposta, {
            foreignKey: 'id_usuario',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          });
          this.belongsTo(models.Conteudo, { foreignKey: 'id_usuario', as: 'Conteudo' });
        }
    }

    Usuario.init({
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
        },
  
        usuario: {
          type: DataTypes.STRING,
          allowNull: false,
        },
  
        senha: {
          type: DataTypes.STRING,
          allowNull: false,
        },
  
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },     
        tipo_perfil: {
          type: DataTypes.STRING,
          allowNull: true,
        },
  
        imagem_perfil:{
          type: DataTypes.STRING,
          allwNull: true,
        },
    }, {
        sequelize,
        modelName: 'Usuario',
        tableName: 'Usuario',
    });

    return Usuario;
}

// module.exports = (sequelize, DataTypes) => {
//     const Usuario = sequelize.define('Usuario', {
//       nome: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },

//       usuario: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },

//       senha: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },

//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },     
//       perfil: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//       },

//       imagemPerfil:{
//         type: DataTypes.STRING,
//         allwNull: true,
//       },
//     },{
//       tableName: 'usuarios'
//     });
  
//     Usuario.associate = (models) => {
//       // Associação com Comentario

  
//       // Associação com Perguntas
//       Usuario.hasMany(models.Questões, {
//         foreignKey: 'usuarioId',
//         onDelete: 'CASCADE',
//         onUpdate: 'CASCADE',
//       });
  
//       // Associação com Respostas
//       Usuario.hasMany(models.Resposta, {
//         foreignKey: 'usuarioId',
//         onDelete: 'CASCADE',
//         onUpdate: 'CASCADE',
//       });
//     };
  
//     return Usuario;
//   };
  