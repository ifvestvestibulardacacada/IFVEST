const { Simulados } = require('../../models');


exports.AddQuestoesController = async (req, res) => {
    try {
      const { simuladoId } = req.params;
      const { selectedQuestionIds } = req.body;
  
      const idsInteiros = selectedQuestionIds.split(',').map(Number);
  
      const simulado = await Simulados.findByPk(simuladoId);
  
      if (!simulado) {
        throw new Error('Simulado não encontrado.');
      }
      if (!idsInteiros) {
        throw new Error('Questões não selecionadas.');
      }
  
      await simulado.addQuestões(idsInteiros);
  
      res.redirect(`/simulados/meus-simulados`);
    } catch (error) {
      console.error(error);
      req.session.errorMessage = err.message;
      res.redirect('back')
    }
  }