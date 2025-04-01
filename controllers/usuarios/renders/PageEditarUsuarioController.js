const { Router } = require('express');
const { Usuario } = require('../../../models');

exports.PageEditarUsuarioController = async (req, res) => {
    try {
        let errorMessage = req.session.errorMessage;

        if (!req.session.userId) {
            throw new Error('Você precisa estar logado para acessar esta página.');
        }
        const usuario = await Usuario.findByPk(req.session.userId);

        if (!usuario) {
            throw new Error('Usuário não encontrado.');
        }


        if (errorMessage === null) {
            errorMessage = " ";
        }

        req.session.errorMessage = null;
        res.render('usuario/editar-usuario', { usuario, session: req.session, errorMessage });
    } catch (err) {
        console.error(err)
        res.redirect('/login');
    }
}

