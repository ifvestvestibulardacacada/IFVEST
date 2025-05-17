

// models/perguntas_provas.js

'use strict';

module.exports = (sequelize, DataTypes) => {
  const QuestaoSimulado = sequelize.define('QuestaoSimulado', {
    id_questao_simulado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_questao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Questões',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_simulado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Simulados',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    tableName: 'perguntas_provas' // Especifique o nome correto da tabela
  });

  return QuestaoSimulado;
};
