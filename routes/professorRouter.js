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
const { Database } = require("../modules/Database")

const roteador = Router()

//topicos
roteador.get('/topicos', Render.topicos.meusTopicos);
roteador.get('/topicos/:id', Database.topicos.getAll); // ! TopicosController
roteador.post('/editar-topico', Database.topicos.edit); // ! EditarTopicoController
roteador.post('/registrar-topico', Database.topicos.register); // ! RegistrarTopicoController

//questoes
roteador.get('/registrar-questao/:tipo', Render.questoes.registrarQuestao );
roteador.get('/manutencao', Render.questoes.manutencao);
roteador.get('/questoes', Render.questoes.minhasQuestoes );
roteador.get('/editar-questao/:id', Render.questoes.editar);

roteador.post('/registrar-questao/:tipo', Database.questoes.register); // ! RegistrarQuestaoController

roteador.patch('/editar-questao', Database.questoes.edit); // ! UpdateQuestaoController

roteador.delete('/excluir-questao/:id', Database.questoes.delete); // ! DeleteQuestaoController


module.exports = roteador;