
const { Simulados } = require('../../../models');

exports.PageEditarSimuladoController = async (req, res) => {
    const simuladoId = req.params.id
    const perfilUsuario = req.session.perfil;
    const nomeUsuario = req.session.nomeUsuario;
    const imagemPerfil = req.session.imagemPerfil;
    try {
      const simulado = await Simulados.findOne({
        where: { id: simuladoId },
      });
  
      if (!simulado) {
        throw new Error('Simulado não encontrado ');
      }
      let errorMessage = req.session.errorMessage;
  
      if (errorMessage === null) {
        errorMessage = " ";
      }
      req.session.errorMessage = null;
  
      res.render('simulado/editar-simulado', { simulado, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }