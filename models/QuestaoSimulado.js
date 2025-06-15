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
        model: 'Questao',
        key: 'id_questao'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_simulado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Simulado',
        key: 'id_simulado'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    }
  }, {
    tableName: 'QuestaoSimulado', // Especifique o nome correto da tabela
    timestamps: true // Adiciona gerenciamento automático de timestamps
  });

  return QuestaoSimulado;
};
