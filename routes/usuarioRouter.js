const { Router } = require('express');

const roteador = Router()

const { Render } = require("../modules/Render")
const { Database } = require("../modules/Database")
const validateRequest = require('../middleware/validateRequest');
const { userSchemas } = require('../validations/schemas');

//page renders
roteador.get('/sobre_nos', Render.usuarios.sobreNos);
roteador.get('/perfil', Render.usuarios.perfilUsuario);
roteador.get('/inicioLogado', Render.usuarios.inicioLogado);
roteador.get('/editar', Render.usuarios.editarUsuario);

//update
roteador.patch('/editar/:id',validateRequest(userSchemas.edit), Database.usuarios.edit); // ! EditarUsuarioController

//delete
roteador.delete('/:id', Database.usuarios.delete ); // ! DeleteUsuarioController

module.exports = roteador;

