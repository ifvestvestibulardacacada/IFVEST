const { Simulados } = require('../../../models');
const { Questões } = require('../../../models');
const { Op } = require('sequelize');

exports.PageRemoveQuestoesController = async (req, res) => {
    try {
      const perfilUsuario = req.session.perfil;
      const nomeUsuario = req.session.nomeUsuario;
      const imagemPerfil = req.session.imagemPerfil;
      const simuladoId = req.params.simuladoId;
      const { titulo } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
  
      const simulado = await Simulados.findOne({
        where: { id: simuladoId },
        include: [
          {
            model: Questões,
            as: 'Questões', through: { attributes: [] }
          }
        ]
      });
  
      if (!simulado) {
        throw new Error('Simulado não encontrado');
      }
  
      const questaoIds = simulado.Questões && simulado.Questões.length > 0 ? simulado.Questões.map(questao => questao.id) : [];
  
      const todasQuestoes = await Questões.findAll({
        where: { id: { [Op.in]: questaoIds } },
        include: [{
          model: Simulados,
          as: 'Simulados',
          where: { id: simuladoId },
          through: { attributes: [] }
        }],
        limit: limit,
        offset: offset
      });
  
      let questoes = todasQuestoes;
  
      if (titulo) {
        questoes = todasQuestoes.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
      }
      const totalQuestoes = await Questões.count({
        where: { id: { [Op.in]: questaoIds } },
        include: [{
          model: Simulados,
          as: 'Simulados',
          where: { id: simuladoId },
          through: { attributes: [] }
        }]
      });
      const totalPages = Math.ceil(totalQuestoes / limit);
  
      let errorMessage = req.session.errorMessage;
  
      if (errorMessage === null) {
        errorMessage = " ";
      }
  
      req.session.errorMessage = null;
  
      res.render('simulado/remover-questoes', { simulado: simulado, questoes: questoes, page: page, totalPages: totalPages, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
    } catch (error) {
      console.error('Erro ao carregar o formulário de edição do simulado:', error);
      res.status(500).send('Erro ao carregar o formulário de edição do simulado.');
    }
  }