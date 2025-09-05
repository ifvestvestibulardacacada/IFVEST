const { Router } = require('express')
const controllers = require('./controllers')
const Nayahath = require('../../logs/ArcanaFlow.js')

const { buscarArea, buscarAssunto, buscarTopico, buscarMaterial, criarMaterial, editarMaterial, home } = controllers


const router = Router()



// const { Render } = require('../modules/Render')
// const { Database } = require('../modules/Database')

// ! Logs lib
// const Nayahath = require('../logs/ArcanaFlow')
Nayahath.addEntity('Revisão', 'magenta')
Nayahath.action('Revisão', 'Router carregado com sucesso')

// Páginas de busca
router.get('/', home)
router.get('/busca', buscarAssunto)
router.get('/busca/:id_assunto', buscarAssunto)
// router.get('/busca/:id_area', buscarTopico)
// router.get('/busca/:id_area/:id_topico', buscarMaterial)

// Leitura de material
// router.get('/conteudo/:id_conteudo')

// Criação e edição de material
router.get('/criar_material', criarMaterial)
router.get('/editar_material/:id_conteudo', editarMaterial)

// Barra de pesquisa
router.post('/buscar_area', buscarArea)
router.post('/buscar_topico', buscarTopico)
router.post('/buscar_material', buscarMaterial)

// Criação, edição e remoção de materiais
router.post('/criar_material', criarMaterial)
router.post('/editar_material/:id_conteudo', editarMaterial)
// router.post('/remover_material/:id_conteudo', removerMaterial)

// Consulta para pegar as palavras-chave // ! Em avaliação

module.exports = router