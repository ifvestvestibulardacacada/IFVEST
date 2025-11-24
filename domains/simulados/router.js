const { Router } = require('express');
const {
    home,
    manutencao,

    // Simulados
    criarSimulado,
    editarSimulado,
    fazerSimulado,
    gabarito,
    imprimirSimulado,
    meusSimulados,
    visualizarSimulado,

    // Questões
    adicionarQuestoes,
    getSimulado,
    editarQuestao,
    minhasQuestoes,
    registrarQuestao,
    removerQuestoes
} = require('./controllers')

const validateRequest = require('../../middleware/validateRequest')
const { simuladoSchemas, questionSchemas, topicoSchemas } = require('../../validations/schemas')

//! Tenporário
const writeControllers = require('./controllers/write-controllers')

const router = Router()

// Simulados

router.get('/', home)

router.get('/criar-simulado', criarSimulado);
router.get('/:id/editar', editarSimulado);
router.get('/:simuladoId/imprimir', imprimirSimulado);
router.get('/meus-simulados', meusSimulados );
router.get('/visualizar', visualizarSimulado );
router.get('/:simuladoId/remover-questoes', removerQuestoes);
router.get('/:simuladoId/adicionar-questoes', adicionarQuestoes);
router.get('/:simuladoId/fazer', fazerSimulado);
router.get('/:simuladoId/gabarito', gabarito);
router.get('/busca/:id', getSimulado);

//create 
router.post('/criar-simulado',validateRequest(simuladoSchemas.register), writeControllers.adicionarSimulado);
router.post('/:simuladoId/adicionar-questoes', writeControllers.vincularQuestao);
router.post('/responder-prova/:simuladoId', writeControllers.submeterSimulado);

//update
router.patch('/:simuladoId/editar',validateRequest(simuladoSchemas.edit), writeControllers.editarSimulado);

//delete
router.delete('/:simuladoId/remover-questoes', writeControllers.removerQuestao);
router.delete('/:simuladoId/excluir-simulado', writeControllers.apagarSimulado);



// Questões

router.get('/registrar-questao/:tipo', registrarQuestao );
router.get('/manutencao', manutencao);
router.get('/questoes', minhasQuestoes );
router.get('/editar_questao/:id', editarQuestao);

router.post('/registrar-questao/:tipo', writeControllers.adicionarQuestao); // ! RegistrarQuestaoController

router.post('/editar_questao', writeControllers.editarQuestao); // ! UpdateQuestaoController

router.delete('/excluir-questao/:id', writeControllers.apagarQuestao); // ! DeleteQuestaoController

module.exports = router