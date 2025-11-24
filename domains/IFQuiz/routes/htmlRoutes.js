const router = require('express').Router();
const { Placar } = require('../../../models');

router.get('/', (req, res) => {
    
    res.render('inicio', { 
        nomeUsuario: req.session.nomeUsuario, 
        currentPage: 'quiz',
        perfilUsuario: req.session.perfilUsuario,
        imagemPerfil: req.session.imagemPerfil 
    });
});

router.get('/placar', (req, res) => {
    res.render('placar', {
        nomeUsuario: req.session.nomeUsuario,
        currentPage: 'quiz',
        perfilUsuario: req.session.perfilUsuario,
        imagemPerfil: req.session.imagemPerfil
    });
});

router.get('/MenuQuiz', (req, res) => {
    
    res.render('MenuQuiz', { 
        nomeUsuario: req.session.nomeUsuario, 
        currentPage: 'quiz',
        perfilUsuario: req.session.perfilUsuario,
        imagemPerfil: req.session.imagemPerfil
    });
});

module.exports = router;