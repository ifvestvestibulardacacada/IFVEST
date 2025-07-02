const sequelize = require('sequelize');
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    static associate(models) {
      this.hasMany(models.Topico, { foreignKey: 'id_topico', as: 'Topico' })
      this.hasMany(models.Questao, { foreignKey: 'id_questao', as: 'Questao' })
    }
  }

  Area.init({
    id_area: {
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
    }

  }, {
    sequelize,
    modelName: 'Area',
    tableName: 'Area'
  })

  return Area
}





// module.exports = (sequelize, DataTypes) => {
//   const Area = sequelize.define('Area', {
//     area: DataTypes.STRING,
//     descricao: DataTypes.STRING,
//   }, {
//     tableName: 'Area'
//   });

//   Area.associate = (models) => {
//     Area.hasMany(models.Topico, {
//       foreignKey: 'id_area',
//       as: 'Topico'
//     });
//     Area.hasMany(models.Questao, {
//       foreignKey: 'id_area',
//       as: 'Questao'
//     });
//   }
//   return Area;
// };  