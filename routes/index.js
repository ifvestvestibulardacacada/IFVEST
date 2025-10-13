const usuarios = require('./usuarioRouter');
const inicio = require('./inicioRouter');
const professor = require('./professorRouter')
const simulados = require('./simuladosRouter')
const uploads = require('./uploadRouter')
const revisao = require('./revisaoRouter')
const dificuldades = require('./dificuldadesRouter')
const areas = require('./areasRouter')
const topicos = require('./topicosRouter')

//export de rotas
const routes = {
    usuarios: usuarios,
    inicio: inicio,
    professor: professor,
    simulados: simulados,
    uploads: uploads,
    revisao: revisao,
    dificuldades: dificuldades,
    areas: areas,
    topicos: topicos,
}

module.exports = routes;