
const { Simulados } = require('../../../models');

exports.PageMeusSimuladosController =async (req, res) => {
    try {
      const perfilUsuario = req.session.perfil;
      const nomeUsuario = req.session.nomeUsuario;
      const imagemPerfil = req.session.imagemPerfil;
      const { titulo } = req.query;
      const idUsuario = req.session.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
  
      let allSimulados = await Simulados.findAll({
        where: { usuarioId: idUsuario },
        order: [['createdAt', 'DESC']]
      });
  
      if (titulo) {
        const simulados = allSimulados.filter(s => s.titulo.toLowerCase().includes(titulo.toLowerCase()));
        allSimulados = simulados
      }
  
      const totalPages = Math.ceil(allSimulados.length / limit);
      const startIndex = offset;
      const endIndex = offset + limit;
      const simuladosPaginated = allSimulados.slice(startIndex, endIndex);
  
      let errorMessage = req.session.errorMessage;
  
      if (errorMessage === null) {
        errorMessage = " ";
      }
      req.session.errorMessage = null;
  
      res.render('simulado/meus-simulados', { simulados: simuladosPaginated, currentPage: page, totalPages, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
    } catch (error) {
      console.error(error);
      res.status(500).send('Ocorreu um erro ao recuperar os questionários.');
    }
  }