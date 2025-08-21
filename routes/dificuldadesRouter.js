const { Router } = require('express');
const validateRequest = require('../middleware/validateRequest');
const { dificuldadesSchemas } = require('../validations/schemas');
const { Render } = require("../modules/Render")
const { Database } = require("../modules/Database")

const roteador = Router();

// Page render
roteador.get('/dificuldades', Render.dificuldades.dificuldades);

// CRUD actions
roteador.get('/', Database.dificuldades.getAll);
roteador.post('/criar-dificuldade', validateRequest(dificuldadesSchemas.register), Database.dificuldades.create);
roteador.patch('/:id/editar', validateRequest(dificuldadesSchemas.edit), Database.dificuldades.update);
roteador.delete('/:id/excluir', Database.dificuldades.delete);

module.exports = roteador;
