// models/Opcoes.js
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {

    class Opcao extends Model {
        static associate(models) {
            this.belongsTo(models.Questao, { foreignKey: 'id_questao', as: 'Questao' });
            this.hasMany(models.Resposta, { foreignKey: 'id_opcao', as: 'Resposta' });
        }
    }

    Opcao.init({
        id_opcao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_questao: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        correta: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false 
        },
        alternativa: {
            type: DataTypes.ENUM({
                values: ['A', 'B', 'C', 'D', 'E']
        }),
        allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Opcao',
        tableName: 'Opcao',
    });

    return Opcao;
}