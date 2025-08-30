"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var index_1 = require("./controllers/index");
var ArcanaFlow_js_1 = require("../../logs/ArcanaFlow.js");
var buscarArea = index_1.default.buscarArea, buscarTopico = index_1.default.buscarTopico, buscarMaterial = index_1.default.buscarMaterial, criarMaterial = index_1.default.criarMaterial, editarMaterial = index_1.default.editarMaterial, home = index_1.default.home;
var router = (0, express_1.Router)();
// const { Render } = require('../modules/Render')
// const { Database } = require('../modules/Database')
// ! Logs lib
// const Nayahath = require('../logs/ArcanaFlow')
ArcanaFlow_js_1.addEntity('Revisão', 'magenta');
ArcanaFlow_js_1.action('Revisão', 'Router carregado com sucesso');
// Páginas de busca
router.get('/', home);
router.get('/busca', buscarArea);
router.get('/busca/:id_area', buscarTopico);
router.get('/busca/:id_area/:id_topico', buscarMaterial);
// Leitura de material
// router.get('/conteudo/:id_conteudo')
// Criação e edição de material
router.get('/criar_material', criarMaterial);
router.get('/editar_material/:id_conteudo', editarMaterial);
// Barra de pesquisa
router.post('/buscar_area', buscarArea);
router.post('/buscar_topico', buscarTopico);
router.post('/buscar_material', buscarMaterial);
// Criação, edição e remoção de materiais
router.post('/criar_material', criarMaterial);
router.post('/editar_material/:id_conteudo', editarMaterial);
// router.post('/remover_material/:id_conteudo', removerMaterial)
// Consulta para pegar as palavras-chave // ! Em avaliação
exports.default = router;
