const { Questões } = require('../../models');
const { Opcao } = require('../../models');

exports.DeleteQuestaoController = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Busca a questão pelo ID
      const questao = await Questões.findByPk(id);
  
      if (!questao) {
        return res.status(404).send('Questão não encontrada');
      }
  
      // Exclui as opções da questão
      await Opcao.destroy({
        where: { questao_id: questao.id }
      });
  
      // Exclui a questão
      await questao.destroy();
  
      res.status(200).redirect('/usuario/inicioLogado')
    } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      res.redirect('back')
    }
  }