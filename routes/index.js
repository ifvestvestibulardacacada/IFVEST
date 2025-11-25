const usuarios = require('./usuarioRouter');
const inicio = require('./inicioRouter');
const uploads = require('./uploadRouter')
const dificuldades = require('./dificuldadesRouter')
//export de rotas
const routes = {
    usuarios: usuarios,
    inicio: inicio,
    uploads: uploads,
    dificuldades: dificuldades
}

module.exports = routes;