const { Router } = require('express');

exports.PageCriarSimuladoController = async (req, res) => {
    const perfilUsuario = req.session.perfil;
    const nomeUsuario = req.session.nomeUsuario;
    const imagemPerfil = req.session.imagemPerfil;
    let errorMessage = req.session.errorMessage;
    if (errorMessage === null) {
        errorMessage = " ";
    }

    req.session.errorMessage = null;

    res.render('simulado/criar-simulado', { errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
};
