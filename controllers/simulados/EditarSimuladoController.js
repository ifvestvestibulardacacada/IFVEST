

const { Simulados } = require('../../models');


exports.EditarSimuladoController = async (req, res) => {
    try {
      const { simuladoId } = req.params;
      const { titulo, descricao, tipo } = req.body;
  
      const [updated] = await Simulados.update({
        titulo: titulo,
        descricao: descricao,
        tipo: tipo
      }, {
        where: {
          id: simuladoId
        }
      });
  
      if (!updated) {
        throw new Error('Simulado não encontrado ou não atualizado');
      }
      res.redirect("/simulados/meus-simulados")
    } catch (error) {
      console.error(error);
      req.session.errorMessage = err.message;
      res.redirect('back')
    }
  }
  