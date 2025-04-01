const { Questões } = require('../../models');
const { Simulados } = require('../../models');


exports.RemoveQuestoesController = async (req, res) => {
    try {
      const { simuladoId } = req.params;
      const { questoesSelecionadas } = req.body;
  
      // Primeiro, verifique se o simulado existe
      const simulado = await Simulados.findByPk(simuladoId, {
        include: [{
          model: Questões,
          as: 'Questões'
        }]
      });
  
      if (!simulado) {
        return res.status(404).send('Simulado não encontrado.');
      }
      if (!questoesSelecionadas || questoesSelecionadas.length === 0) {
        return res.status(404).send('Questões não selecionadas.');
      }
  
      // Agora, remova as questões do simulado usando o método removeQuestoes
      // Este método é fornecido pelo Sequelize para associações belongsToMany
      await simulado.removeQuestões(questoesSelecionadas);
  
      res.redirect(`/simulados/`);
    } catch (error) {
      console.error(error);
      req.session.errorMessage = err.message;
      res.redirect('back')
    }
  }