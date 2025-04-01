const { Router } = require('express');

const { PagePerfilUsuarioController } = require('../controllers/usuarios/renders/PagePerfilUsuarioController');
const { PageInicioLogadoController } = require('../controllers/usuarios/renders/PageInicioLogadoController');
const { PageEditarUsuarioController } = require('../controllers/usuarios/renders/PageEditarUsuarioController');
const { EditarUsuarioController } = require('../controllers/usuarios/EditarUsuarioController');
const { DeleteUsuarioController } = require('../controllers/usuarios/DeleteUsuarioController');
const { PageSobreNosController } = require('../controllers/usuarios/renders/PageSobreNosController');

const roteador = Router()

//page renders
roteador.get('/sobreNos', PageSobreNosController);
roteador.get('/perfil', PagePerfilUsuarioController);
roteador.get('/inicioLogado', PageInicioLogadoController);
roteador.get('/editar', PageEditarUsuarioController );

//update
roteador.patch('/editar/:id', EditarUsuarioController);

//delete
roteador.delete('/:id', DeleteUsuarioController );

module.exports = roteador;

