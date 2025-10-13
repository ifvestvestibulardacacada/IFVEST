// Essa pasta "write-controllers" é temporária até que os 
// nomes sejam reestruturados para aprimorar a semântica,
// portanto serve apenas para separar o que antes eram os
// antigos "Render" e "Database"

// Simulados
const adicionarSimulado = require('./adicionarSimulado');
const editarSimulado = require('./editarSimulado');
const submeterSimulado = require('./submeterSimulado');
const apagarSimulado = require('./apagarSimulado');

// Questão
const adicionarQuestao = require('./adicionarQuestao');
const apagarQuestao = require('./apagarQuestao');
const editarQuestao = require('./editarQuestao');
const removerQuestao = require('./removerQuestao');
const vincularQuestao = require('./vincularQuestao');

module.exports = {
    // Simulados
    adicionarSimulado,
    editarSimulado,
    submeterSimulado,
    apagarSimulado,

    // Questão
    adicionarQuestao,
    apagarQuestao,
    editarQuestao,
    removerQuestao,
    vincularQuestao
}
