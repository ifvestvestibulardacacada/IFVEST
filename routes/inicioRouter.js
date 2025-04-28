const { Router } = require('express');

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
