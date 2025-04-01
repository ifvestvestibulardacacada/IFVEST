const { Router } = require('express');
const { Usuario } = require('../../../models');


exports.PageInicioLogadoController = async (req, res) => {
    const perfilUsuario = req.session.perfil;
    const nomeUsuario = req.session.nomeUsuario;
    const imagemPerfil = req.session.imagemPerfil;
    const id = req.session.userId;
    try {
      const usuario = await Usuario.findByPk(id);
  
      if (!usuario) {
        throw new Error("Usuario nao encontrado")
      }
      res.status(200).render('usuario/inicio-logado', {nomeUsuario, perfilUsuario, imagemPerfil});
    } catch (err) {
      console.error(err)
      req.session.destroy();
      res.redirect('/login');
    }
  };