const { Router } = require('express');

const { Render } = require("../modules/Render")
const { Database } = require("../modules/Database")
const validateRequest = require('../middleware/validateRequest');
const { topicoSchemas, questionSchemas } = require('../validations/schemas');

const roteador = Router()

//topicos
roteador.get('/topicos', Render.topicos.meusTopicos);
roteador.get('/topicos/criar', Render.topicos.criarTopico);
roteador.get('/topicos/:id', Database.topicos.getAll); // ! TopicosController
roteador.post('/editar-topico', validateRequest(topicoSchemas.edit), Database.topicos.edit); // ! EditarTopicoController
roteador.post('/registrar-topico',validateRequest(topicoSchemas.register), Database.topicos.register); // ! RegistrarTopicoController

//questoes
roteador.get('/registrar-questao/:tipo', Render.questoes.registrarQuestao );
roteador.get('/manutencao', Render.questoes.manutencao);
roteador.get('/questoes', Render.questoes.minhasQuestoes );
roteador.get('/editar_questao/:id', Render.questoes.editar);

roteador.post('/registrar-questao/:tipo', Database.questoes.register); // ! RegistrarQuestaoController

roteador.patch('/editar_questao',validateRequest(questionSchemas.edit), Database.questoes.edit); // ! UpdateQuestaoController

roteador.delete('/excluir-questao/:id', Database.questoes.delete); // ! DeleteQuestaoController


module.exports = roteador;