const { Questões } = require('../../../models');
const { Area } = require('../../../models');
const { Topico } = require('../../../models');

exports.PageMinhasQuestoesController = async (req, res) => {
    const perfilUsuario = req.session.perfil;
    const nomeUsuario = req.session.nomeUsuario;
    const imagemPerfil = req.session.imagemPerfil;
    const usuarioId = req.session.userId;
    const { titulo, areaId, topicosSelecionados, pergunta } = req.query; // Adiciona 'pergunta' aos parâmetros recuperados
    const limit = 10; // Número de questões por página
    const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
    const offset = (page - 1) * limit;
  
    try {
      let questoes = await Questões.findAll({
          where: {
            usuarioId: usuarioId,
          },
          include: [{
            model: Area,
            as: 'Area'
          }, {
            model: Topico,
            as: 'Topicos'
          }],
          limit: limit,
          offset: offset,
        });
      
  
      const questoesCount = await Questões.count({
        where: {
          usuarioId: usuarioId,
        },
      });
  
      const totalPages = Math.ceil(questoesCount / limit);
  
      // Buscar todas as áreas para o filtro
      const topicos = await Topico.findAll();
      const Areas = await Area.findAll({
        include: [{
          model: Topico,
          as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
        }]
      });
  
      // Filtrar questões usando JavaScript
      let questoesFiltradas = questoes; // Use 'questoes' em vez de 'questoesDisponiveis'
      if (titulo) {
        questoesFiltradas = questoes.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
      }
      if (areaId && areaId !== "") {
        questoesFiltradas = questoes.filter(questao => questao.areaId === Number(areaId));
      }
      if (topicosSelecionados && topicosSelecionados !== "") {
        // Conversão de topicosSelecionados para Array de IDs
        const topicosIds = Array.isArray(topicosSelecionados) ? topicosSelecionados : topicosSelecionados.split(',').map(id => parseInt(id));
        questoesFiltradas = questoes.filter(questao => {
          // Garante que questao.topicos seja um array
          const topicos = Array.isArray(questao.Topicos) ? questao.Topicos : [];
          return topicos.some(topico => topicosIds.includes(topico.id));
        });
      }
      if (pergunta) {
        questoesFiltradas = questoes.filter(questao => questao.pergunta.toLowerCase().includes(pergunta.toLowerCase()));
      }
  
      let errorMessage = req.session.errorMessage;
  
      if (errorMessage === null) {
        errorMessage = " ";
      }
  
      req.session.errorMessage = null;
      res.status(200).render('professor/minhas-questoes', { questoes: questoesFiltradas, totalPages, page, Areas, topicos, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
    } catch (err) {
      console.error(err.message)    
      req.session.destroy();
      res.status(500).redirect('/usuario/inicioLogado');
    };
  }