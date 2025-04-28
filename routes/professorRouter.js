const { Router } = require('express');

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