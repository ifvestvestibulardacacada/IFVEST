const { Router } = require('express')

const { Render } = require('../modules/Render')
const { Database } = require('../modules/Database')

const router = Router()

// ! Logs lib
const Nayahath = require('../logs/ArcanaFlow')
Nayahath.addEntity('Revisão', 'magenta')
Nayahath.action('Revisão', 'Router carregado com sucesso')

// Páginas de busca
router.get('/', Render.moduloRevisao.home)
router.get('/busca', Render.moduloRevisao.buscarArea)
router.get('/busca/:id_area', Render.moduloRevisao.buscarTopico)
router.get('/busca/:id_area/:id_topico', Render.moduloRevisao.buscarMaterial)

// Leitura de material
router.get('/conteudo/:id_conteudo')

// Criação e edição de material
router.get('/criar_material', Render.moduloRevisao.criarMaterial)
router.get('/editar_material/:id_conteudo', Render.moduloRevisao.editarMaterial)

// Barra de pesquisa
router.post('/buscar_area', Database.moduloRevisao.buscarArea)
router.post('/buscar_topico', Database.moduloRevisao.buscarTopico)
router.post('/buscar_material', Database.moduloRevisao.buscarMaterial)

// Criação, edição e remoção de materiais
router.post('/criar_material', Database.moduloRevisao.criarMaterial)
router.post('/editar_material/:id_conteudo', Database.moduloRevisao.editarMaterial)
router.post('/remover_material/:id_conteudo', Database.moduloRevisao.removerMaterial)

// Consulta para pegar as palavras-chave // ! Em avaliação

module.exports = router;