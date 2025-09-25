const { Router } = require('express')
const controllers = require('./controllers')

const {
    listarAreas,
    criarArea,
    editarArea,
    excluirArea,

    listarAssuntos,
    criarAssunto,
    editarAssunto,
    excluirAssunto,

    listarTopicos,
    criarTopico,
    editarTopico,
    excluirTopico,
} = controllers

const router = Router()

// Áreas
router.get('/areas', listarAreas)
router.post('/areas', criarArea)
router.patch('/areas/:id_area', editarArea)
router.delete('/areas/:id_area', excluirArea)

// Assuntos
router.get('/assuntos', listarAssuntos)
router.post('/assuntos', criarAssunto)
router.patch('/assuntos/:id_assunto', editarAssunto)
router.delete('/assuntos/:id_assunto', excluirAssunto)

// Tópicos
router.get('/topicos', listarTopicos)
router.post('/topicos', criarTopico)
router.patch('/topicos/:id_topico', editarTopico)
router.delete('/topicos/:id_topico', excluirTopico)

module.exports = router
