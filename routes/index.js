const usuarios = require('./usuarioRouter');
const inicio = require('./inicioRouter');
const uploads = require('./uploadRouter')
<<<<<<< HEAD

=======
const revisao = require('./revisaoRouter')
const dificuldades = require('./dificuldadesRouter')
const areas = require('./areasRouter')
const topicos = require('./topicosRouter')
>>>>>>> d8195e0 (feat: architecture change on flashcards domain)

//export de rotas
const routes = {
    usuarios: usuarios,
    inicio: inicio,
    uploads: uploads,
<<<<<<< HEAD
=======
    revisao: revisao,
    dificuldades: dificuldades,
    areas: areas,
    topicos: topicos,
>>>>>>> d8195e0 (feat: architecture change on flashcards domain)
}

module.exports = routes;