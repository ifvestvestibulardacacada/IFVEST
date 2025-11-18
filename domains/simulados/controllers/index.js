const manutencao = require('./manutencao');
const home = require('./home')

// Simulados
const criarSimulado = require('./criarSimulado');
const editarSimulado = require('./editarSimulado');
const fazerSimulado = require('./fazerSimulado');
const gabarito = require('./gabarito');
const imprimirSimulado = require('./imprimirSimulado');
const meusSimulados = require('./meusSimulados');
const visualizarSimulado = require('./visualizarSimulado');


// Questões
const adicionarQuestoes = require('./adicionarQuestoes');
const editarQuestao = require('./editarQuestao');
const minhasQuestoes = require('./minhasQuestoes');
const registrarQuestao = require('./registrarQuestao');
const removerQuestoes = require('./removerQuestoes');
const getSimulado = require('./getSimulado');

module.exports = {
    manutencao,
    home,

    // Simulados
    criarSimulado,
    editarSimulado,
    fazerSimulado,
    gabarito,
    imprimirSimulado,
    meusSimulados,
    visualizarSimulado,
    getSimulado,
    // Questões
    adicionarQuestoes,
    editarQuestao,
    minhasQuestoes,
    registrarQuestao,
    removerQuestoes
}