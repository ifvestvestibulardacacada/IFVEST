
const { Router } = require('express');

const validateRequest = require('../middleware/validateRequest');
const { simuladoSchemas } = require('../validations/schemas');

const { Render } = require("../modules/Render")
const { Database } = require("../modules/Database")

const roteador = Router()
//page renders
roteador.get('/criar-simulado', Render.simulados.criarSimulado);
roteador.get('/:id/editar', Render.simulados.editarSimulado);
roteador.get('/:simuladoId/imprimir', Render.simulados.imprimirSimulado);
roteador.get('/meus-simulados', Render.simulados.meusSimulados );
roteador.get('/visualizar', Render.simulados.visualizarSimulado );
roteador.get('/:simuladoId/remover-questoes', Render.simulados.removerQuestoes);
roteador.get('/:simuladoId/adicionar-questoes', Render.simulados.adicionarQuestoes);
roteador.get('/:simuladoId/fazer', Render.simulados.fazerSimulado);
roteador.get('/:simuladoId/gabarito', Render.simulados.gabarito);
//create 
roteador.post('/criar-simulado',validateRequest(simuladoSchemas.register), Database.simulados.register); // ! RegistrarSimuladoController
roteador.post('/:simuladoId/adicionar-questoes', Database.simulados.addQuestion); // ! AddQuestoesController
roteador.post('/responder-prova/:simuladoId', Database.simulados.submit ); // ! ResponderSimuladoController
//update
roteador.patch('/:simuladoId/editar',validateRequest(simuladoSchemas.edit), Database.simulados.edit); // ! EditarSimuladoController

//delete
roteador.delete('/:simuladoId/remover-questoes', Database.simulados.removeQuestion ); // ! RemoveQuestoesController
roteador.delete ('/:simuladoId/excluir-simulado', Database.simulados.delete);

module.exports = roteador;