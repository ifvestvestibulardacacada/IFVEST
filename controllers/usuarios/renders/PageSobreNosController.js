const { Usuario } = require('../../../models');
const { Router } = require('express');

exports.PageSobreNosController = async (req, res) => {
    const perfilUsuario = req.session.perfil;
    const nomeUsuario = req.session.nomeUsuario;
    const imagemPerfil = req.session.imagemPerfil;
    res.status(200).render('desenvolvedores/sobreNos', {nomeUsuario, perfilUsuario, imagemPerfil});
}