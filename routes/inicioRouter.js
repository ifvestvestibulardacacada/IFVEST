const { Router } = require('express');
const { rateLimit } = require('express-rate-limit')
const { Render } = require("../modules/Render")
const { Auth } = require("../modules/Auth")

const roteador = Router()

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		req.session.errorMessage = 'Você excedeu o número de tentativas de login. Tente novamente mais tarde.';
		res.redirect('/login');
	}
});


// rota da pagina inicial
roteador.get('/', Render.auth.home);
roteador.get('/cadastro', Render.auth.cadastro);
roteador.get('/login',  Render.auth.login);

roteador.post('/logoff', Auth.logout);
roteador.post('/login',
	 limiter,
 Auth.login);
roteador.post('/cadastro', 
	 
	Auth.cadastro);

module.exports = roteador;
