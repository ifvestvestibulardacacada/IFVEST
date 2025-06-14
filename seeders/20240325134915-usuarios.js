'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10; // Define o número de rounds para o bcrypt

module.exports = {
 up: async (queryInterface, Sequelize) => {
    // Definindo um usuário para inserir no banco de dados
    const usuario = {
       nome: 'admin',
      usuario: 'admin123',
      email: 'email@exemplo.com',
      senha: '123', 
      tipo_perfil: 'PROFESSOR',// Senha em texto simples
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Criptografando 
    const hashedPassword = await bcrypt.hash(usuario.senha, saltRounds);

    // Inserindo o usuário no banco de dados com a senha criptografada
    await queryInterface.sequelize.query(
      "INSERT INTO `Usuario` (`nome`,`usuario`, `email`, `senha`,`tipo_perfil`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      { replacements: [usuario.nome, usuario.usuario, usuario.email, hashedPassword, usuario.tipo_perfil] }
    );
 },

 down: async (queryInterface, Sequelize) => {
    // Removendo o usuário inserido pelo seed
    await queryInterface.sequelize.query("DELETE FROM `usuarios` WHERE `email` = ?", { replacements: ['email@exemplo.com'] });
 }
};