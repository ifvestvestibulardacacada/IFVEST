'use strict';
const {  Topico, Questao } = require('../models');

async function atualizarRelacaoTopicos(idQuestao, topicosSelecionados, areaId) {
  try {
    const questao = await Questao.findByPk(idQuestao, {
      include: [{
        model: Topico,
        as: 'Topico',
        attributes: ['id_topico']
      }]
    });

    // Verificar se a questão foi encontrada
    if (!questao) {
      throw new Error('Questão não encontrada');
    }

    const idTopicos = topicosSelecionados.filter(item => !isNaN(item) && item !== '');
  
    // // Adicionar novos tópicos selecionados
    if (areaId && areaId !== questao.id_area) {
      // Usando o método update da própria instância
      await questao.update({ id_area: areaId });
    }

    await questao.setTopico(idTopicos);

  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    await new Promise((resolve, reject) => {
      req.session.save(err => {
        if (err) reject(err);
        else resolve();
      });
    });
    return res.redirect('back');
  }
}

module.exports = {
  atualizarRelacaoTopicos
};