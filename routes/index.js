const usuarios = require('./usuarioRouter');
const inicio = require('./inicioRouter');
const professor = require('./professorRouter')
const simulados = require('./simuladosRouter')
const uploads = require('./uploadRouter')

//export de rotas
const routes = {
    usuarios: usuarios,
    inicio: inicio,
    professor: professor,
    simulados: simulados,
    uploads: uploads,
}

module.exports = routes;