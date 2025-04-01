const { Router } = require('express');

// const { PageMeusTopicosController } = require('../controllers/topicos/renders/PageMeusTopicosController');
const { EditarTopicoController } = require('../controllers/topicos/EditarTopicosController');
const { TopicosController } = require('../controllers/topicos/TopicosController');
const { RegistrarTopicoController } = require('../controllers/topicos/RegistrarTopicoController');
const { DeleteQuestaoController } = require('../controllers/questoes/DeleteQuestaoController');
const { UpdateQuestaoController } = require('../controllers/questoes/UpdateQuestaoController');

// const { PageMinhasQuestoesController } = require('../controllers/questoes/renders/PageMinhasQuestoesController');
// const { PageManutencaoController } = require('../controllers/questoes/renders/PageManutencaoController');
const { RegistrarQuestaoController } = require('../controllers/questoes/RegistrarQuestaoController');
// const { PageRegistrarQuestaoController } = require('../controllers/questoes/renders/PageRegistrarQuestaoController');
// const { PageEditarQuestaoController } = require('../controllers/questoes/renders/PageEditarQuestaoController');

const { Render } = require("../modules/Render")

const roteador = Router()

//topicos
roteador.get('/topicos', Render.topicos.meusTopicos);
roteador.get('/topicos/:id', TopicosController);
roteador.post('/editar-topico', EditarTopicoController);
roteador.post('/registrar-topico', RegistrarTopicoController);

//questoes
roteador.get('/registrar-questao/:tipo', Render.questoes.registrarQuestao );
roteador.get('/manutencao', Render.questoes.manutencao);
roteador.get('/questoes', Render.questoes.minhasQuestoes );
roteador.get('/editar-questao/:id', Render.questoes.editar);

roteador.post('/registrar-questao/:tipo', RegistrarQuestaoController);

roteador.patch('/editar-questao', UpdateQuestaoController);

roteador.delete('/excluir-questao/:id', DeleteQuestaoController);


module.exports = roteador;