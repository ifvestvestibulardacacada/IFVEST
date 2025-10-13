const usuarios = require('./usuarioRouter');
const inicio = require('./inicioRouter');
const uploads = require('./uploadRouter')
<<<<<<< HEAD

<<<<<<< HEAD
const dificuldades = require('./dificuldadesRouter')
const areas = require('./areasRouter')
const topicos = require('./topicosRouter')
=======
=======
const revisao = require('./revisaoRouter')
const dificuldades = require('./dificuldadesRouter')
const areas = require('./areasRouter')
const topicos = require('./topicosRouter')
>>>>>>> d8195e0 (feat: architecture change on flashcards domain)
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)

//export de rotas
const routes = {
    usuarios: usuarios,
    inicio: inicio,
    uploads: uploads,
<<<<<<< HEAD
    dificuldades: dificuldades,
    areas: areas,
    topicos: topicos,
=======
<<<<<<< HEAD
=======
    revisao: revisao,
    dificuldades: dificuldades,
    areas: areas,
    topicos: topicos,
>>>>>>> d8195e0 (feat: architecture change on flashcards domain)
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
}

module.exports = routes;