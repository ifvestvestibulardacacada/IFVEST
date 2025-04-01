const { Simulados } = require('../../../models');
const { Questões } = require('../../../models');
const { Area } = require('../../../models');
const { Topico } = require('../../../models');
const { Op } = require('sequelize');

exports.PageAddQuestoesController = async (req, res) => {
    try {
      const perfilUsuario = req.session.perfil;
      const nomeUsuario = req.session.nomeUsuario;
      const imagemPerfil = req.session.imagemPerfil;
      const simuladoId = req.params.simuladoId;
      const { titulo, areaId, topicosSelecionados } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
  
      const simulado = await Simulados.findOne({
        where: { id: simuladoId },
        include: [{
          model: Questões,
          as: 'Questões'
        }]
      });
  
      if (!simulado) {
        throw new Error('Simulado não encontrado.');
      }
  
  
      const topicos = await Topico.findAll();
      const Areas = await Area.findAll({
        include: [{
          model: Topico,
          as: 'Topico'
        }]
      });
  
  
      let todasQuestoes;
      const tipoQuestao = simulado.tipo === "OBJETIVO" ? 'OBJETIVA' : 
                          simulado.tipo === "DISSERTATIVO" ? 'DISSERTATIVA' : 
                          null;
      
      const whereClause = tipoQuestao ? { tipo: { [Op.eq]: tipoQuestao } } : {};
      
      todasQuestoes = await Questões.findAll({
        include: [
          {
            model: Topico,
            as: 'Topicos',
            through: { attributes: [] },
          },
        ],
        where: whereClause,
      });
  
      const questoesJaAssociadas = simulado.Questões.map(q => q.id);
  //
      const questoesDisponiveis = todasQuestoes.filter(q => !questoesJaAssociadas.includes(q.id));

      //filtros
        let questoesFiltradas = questoesDisponiveis;

// filtro de titulo
      if (titulo) {
        questoesFiltradas = questoesFiltradas.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
      }
      // filtro de area
      if (areaId && areaId !== "") {
        questoesFiltradas = questoesFiltradas.filter(questao => questao.areaId === Number(areaId));
      }
      // filtro de topicos
      if (topicosSelecionados && topicosSelecionados !== "") {
        const topicosIds = Array.isArray(topicosSelecionados) ? topicosSelecionados : topicosSelecionados.split(',').map(id => parseInt(id));
        questoesFiltradas = questoesFiltradas.filter(questao => {
          const topicos = Array.isArray(questao.Topicos) ? questao.Topicos : [];
          return topicos.some(topico => topicosIds.includes(topico.id));
        });
      }
  
      const questoes = questoesFiltradas.slice(offset, offset + limit);
  
      const totalQuestoes = questoesFiltradas.length;
      const totalPages = Math.ceil(totalQuestoes / limit);
  
      const questoesPorArea = {};
  
      simulado.Questões.forEach(q => {
        const areaId = q.areaId;
        if (!questoesPorArea[areaId]) {
          questoesPorArea[areaId] = 0;
        }
        questoesPorArea[areaId]++;
      });
      let errorMessage = req.session.errorMessage;
  
      if (errorMessage === null) {
        errorMessage = " ";
      }
  
      req.session.errorMessage = null;
  
      res.render('simulado/associar-pergunta-simulado', { simulado, questoes, page, totalPages, Areas, topicos, questoesPorArea, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao carregar formulário de associação de pergunta');
    }
  }