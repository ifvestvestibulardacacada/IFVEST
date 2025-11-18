const usuarios = require('./usuarioRouter');
const inicio = require('./inicioRouter');
const uploads = require('./uploadRouter')

const dificuldades = require('./dificuldadesRouter')
const areas = require('./areasRouter')
const topicos = require('./topicosRouter')

//export de rotas
const routes = {
    usuarios: usuarios,
    inicio: inicio,
    uploads: uploads,
    dificuldades: dificuldades,
    areas: areas,
    topicos: topicos,
}

module.exports = routes;