const usuarios = require('./usuarioRouter');
const inicio = require('./inicioRouter');
const professor = require('./professorRouter')
const simulados = require('./simuladosRouter')
const uploads = require('./uploadRouter')
const revisao = require('./revisaoRouter')
const flashcards = require('./flashcardsRouter')
const dificuldades = require('./dificuldadesRouter')
const topicos = require('./topicosRouter')
const area = require('./areasRouter')

//export de rotas
const routes = {
    usuarios: usuarios,
    inicio: inicio,
    professor: professor,
    simulados: simulados,
    uploads: uploads,
    revisao: revisao,
    flashcards: flashcards,
    dificuldades: dificuldades,
    topicos: topicos,
    area: area  
}

module.exports = routes;