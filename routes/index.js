const usuarios = require('./usuarioRouter');
const inicio = require('./inicioRouter');
const professor = require('./professorRouter')
const simulados = require('./simuladosRouter')
const uploads = require('./uploadRouter')
const revisao = require('./revisaoRouter')

//export de rotas
const routes = {
    usuarios: usuarios,
    inicio: inicio,
    professor: professor,
    simulados: simulados,
    uploads: uploads,
    revisao: revisao,
}

module.exports = routes;