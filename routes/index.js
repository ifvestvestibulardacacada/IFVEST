const usuarios = require('./usuarioRouter');
const inicio = require('./inicioRouter');
const uploads = require('./uploadRouter')


//export de rotas
const routes = {
    usuarios: usuarios,
    inicio: inicio,
    uploads: uploads,
}

module.exports = routes;