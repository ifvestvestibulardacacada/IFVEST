const { Topico } = require('../models');
const { Questao } = require('../models');


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

    const topicosIdsAtuais = questao.Topico.map(topico => topico.id_topico);

    const idTopicos = topicosSelecionados.filter(item => !isNaN(item) && item !== '');
    // Adicionar novos tópicos selecionados
    if (areaId && areaId !== questao.id_area) {
      // Atualizar a área da questão
      await Questao.update({
        id_area: areaId,
      }, {
        where: { id_questao: idQuestao }
      });
    }

    await questao.addTopico(idTopicos);
    await questao.removeTopico(topicosIdsAtuais);
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    await new Promise((resolve, reject) => {
      req.session.save(err => {
        if (err) reject(err);
        else resolve();
      });
    });
    return res.redirect(req.get('referer') || req.originalUrl);
  }
}

module.exports = {
  atualizarRelacaoTopicos
};