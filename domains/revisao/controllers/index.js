const buscarArea = require('./buscarArea');
const buscarAssunto = require('./buscarAssunto')
const buscarTopico = require('./buscarTopico');
const buscarMaterial = require('./buscarMaterial');
const criarMaterial = require('./criarMaterial');
const editarMaterial = require('./editarMaterial');
const home = require('./home');
const leitura = require('./leitura')
const meusMateriais = require('./meusMateriais')
const registrarMaterial = require('./registrarMaterial')
const atualizarMaterial = require('./atualizarMaterial')
const uploadHandler = require('./uploadController');
const removerMaterial = require('./removerMaterial');
module.exports = {
    buscarArea,
    buscarAssunto,
    buscarTopico,
    buscarMaterial,
    criarMaterial,
    editarMaterial,
    home,
    leitura,
    meusMateriais,
    registrarMaterial,
    atualizarMaterial,
    removerMaterial,
    uploadHandler
}