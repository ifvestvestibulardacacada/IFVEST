const { Router } = require('express');

// const { LogoutController } = require('../controllers/auth/logoutController');
// const { CadastroController } = require('../controllers/auth/CadastroController');
// const { LoginController } = require('../controllers/auth/LoginController');
// const { PageHomeController } = require('../controllers/auth/renders/PageHomeController');
// const { PageCadastroController } = require('../controllers/auth/renders/PageCadastroController');
// const { PageLoginController } = require('../controllers/auth/renders/PageLoginController');

const roteador = Router()

const { Render } = require("../modules/Render")
const { Auth } = require("../modules/Auth")

// rota da pagina inicial
roteador.get('/', Render.auth.home);
roteador.get('/cadastro', Render.auth.cadastro);
roteador.get('/login', Render.auth.login);

roteador.post('/logoff', Auth.logout);
roteador.post('/login', Auth.login);
roteador.post('/cadastro', Auth.cadastro);

module.exports = roteador;
