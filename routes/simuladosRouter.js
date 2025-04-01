
const { Router } = require('express');

const { PageEditarSimuladoController } = require('../controllers/simulados/renders/PageEditarSimuladoController');
const { PageCriarSimuladoController } = require('../controllers/simulados/renders/PageCriarSimuladoController');
const { RegistrarSimuladoController } = require('../controllers/simulados/RegistrarSimuladoController');
const { PageImprimirSimuladoController } = require('../controllers/simulados/renders/PageImprimirSimuladoController');
const { EditarSimuladoController } = require('../controllers/simulados/EditarSimuladoController');
const { PageMeusSimuladosController } = require('../controllers/simulados/renders/PageMeusSimuladosController');
const { PageVisualizarSimuladosController } = require('../controllers/simulados/renders/PageVisualizarSimuladoController');
const { PageRemoveQuestoesController } = require('../controllers/simulados/renders/PageRemoveQuestoesController');
const { PageAddQuestoesController } = require('../controllers/simulados/renders/PageAddQuestoesController');
const { AddQuestoesController } = require('../controllers/simulados/AddQuestoesController');
const { RemoveQuestoesController } = require('../controllers/simulados/RemoveQuestoesController');
const { PageFazerSimuladoController } = require('../controllers/simulados/renders/PageFazerSimuladoController');
const { PageGabaritoController } = require('../controllers/simulados/renders/PageGabaritoController');
const { ResponderSimuladoController } = require('../controllers/simulados/ResponderSimuladoController');


const roteador = Router()
//page renders
roteador.get('/criar-simulado', PageCriarSimuladoController);
roteador.get('/:id/editar', PageEditarSimuladoController);
roteador.get('/:simuladoId/imprimir', PageImprimirSimuladoController);
roteador.get('/meus-simulados', PageMeusSimuladosController );
roteador.get('/visualizar', PageVisualizarSimuladosController );
roteador.get('/:simuladoId/remover-questoes', PageRemoveQuestoesController);
roteador.get('/:simuladoId/adicionar-questoes', PageAddQuestoesController);
roteador.get('/:simuladoId/fazer', PageFazerSimuladoController);
roteador.get('/:simuladoId/gabarito', PageGabaritoController);
//create 
roteador.post('/criar-simulado', RegistrarSimuladoController);
roteador.post('/:simuladoId/adicionar-questoes', AddQuestoesController);
roteador.post('/responder-prova/:simuladoId', ResponderSimuladoController );
//update
roteador.patch('/:simuladoId/editar', EditarSimuladoController);

//delete
roteador.delete('/:simuladoId/remover-questoes', RemoveQuestoesController );

module.exports = roteador;