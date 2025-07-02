'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MaterialExterno extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Conteudo, { through: 'Recomendacao', foreignKey: 'id_material_externo', as: 'Conteudo' });
    }
  }
  MaterialExterno.init({
    id_material_externo: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    material: DataTypes.STRING,
    tipo_material: DataTypes.STRING // ! Potencialmente isso pode virar um ENUM.
  }, {
    sequelize,
    modelName: 'MaterialExterno',
  });
  return MaterialExterno;
};