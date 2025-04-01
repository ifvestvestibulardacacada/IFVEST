const { Router } = require('express');

const { LogoutController } = require('../controllers/auth/logoutController');
const { CadastroController } = require('../controllers/auth/CadastroController');
const { LoginController } = require('../controllers/auth/LoginController');
const { PageHomeController } = require('../controllers/auth/renders/PageHomeController');
const { PageCadastroController } = require('../controllers/auth/renders/PageCadastroController');
const { PageLoginController } = require('../controllers/auth/renders/PageLoginController');

const roteador = Router()

// rota da pagina inicial
roteador.get('/', PageHomeController);
roteador.get('/cadastro', PageCadastroController);
roteador.get('/login', PageLoginController);

roteador.post('/logoff', LogoutController);
roteador.post('/login', LoginController);
roteador.post('/cadastro', CadastroController);

module.exports = roteador;
