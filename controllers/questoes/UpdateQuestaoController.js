const { Questões } = require('../../models');
const { Opcao } = require('../../models');
const { atualizarRelacaoTopicos } = require('../../utils/AreaTopicoUtil')

exports.UpdateQuestaoController = async (req, res) => {
    try {
      const { id, titulo, pergunta, correta, respostasSelecionadas } = req.body;
      const { areaId, topicosSelecionados } = req.body;
        
      const ArrayRespostas = JSON.parse(respostasSelecionadas)
  
  
      const numOpcoes = Object.keys(ArrayRespostas).length;
  
      const alternativas = ['A', 'B', 'C', 'D', 'E'];
  
      const opcoes = alternativas.slice(0, numOpcoes).map(alternativa => ({
        alternativa,
        descricao: ArrayRespostas[`#opcao${alternativa}`].content,
        id: ArrayRespostas[`#opcao${alternativa}`].id// Descrição padrão se não existir
    }));
  
  
      await atualizarRelacaoTopicos(id, topicosSelecionados, areaId);
  
      const questao = await Questões.findByPk(id, {
        include: [{
          model: Opcao,
          as: 'Opcoes'
        }
        ]
      });
  
      if (!questao) {
        return res.status(404).send('Questão não encontrada');
      }
  
      await Questões.update({
        titulo: titulo,
        pergunta: pergunta,
  
  
      }, {
        where: { id: id }
      });
  
      if (!opcoes) {
        throw new Error("Selected answers cannot be empty");
      }
      for (let opcao of opcoes) {
        // Inicializa o objeto de atualização
        const updateData = {
          descricao: JSON.stringify(opcao.descricao),
          alternativa: opcao.alternativa,
        };
      
  
        if (correta) {
          updateData.correta = correta === opcao.alternativa;
        }
      
        await Opcao.update(updateData, {
          where: { id: opcao.id }
        });
      }
      res.redirect('/professor/questoes');
    } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      res.redirect('back')
    }
  }