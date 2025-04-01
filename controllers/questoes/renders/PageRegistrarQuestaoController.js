const { Area } = require('../../../models');
const { Simulados } = require('../../../models');
const { Topico } = require('../../../models');
const { Op } = require('sequelize');

exports.PageRegistrarQuestaoController = async (req, res) => {
    try {
      if (!req.session.login) {
        return res.status(401).redirect('/usuario/login');
      }
      const perfilUsuario = req.session.perfil;
      const nomeUsuario = req.session.nomeUsuario;
      const imagemPerfil = req.session.imagemPerfil;
  
      const tipo = req.params.tipo.toLowerCase();
      const usuarioId = req.session.userId;
      //req.session.tipoQuestao = tipo; // Armazena o tipo de questão na sessão
  
      const Areas = await Area.findAll({
        include: [{
          model: Topico,
          as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
        }]
      })
  
  
      // Mapeamento dos tipos de questões aos tipos de simulados
      const tipoSimuladoMap = {
        "objetiva": ['ALEATORIO', 'OBJETIVO'],
        "dissertativa": ['DISSERTATIVO', 'ALEATORIO']
      };
  
      // Verifica se o tipo de questão é válido
      if (!tipoSimuladoMap[tipo]) {
        throw new Error('Tipo de questão inválido');
      }
  
      // Consulta todos os simulados do usuário, filtrando por tipo
      const simulados = await Simulados.findAll({
        where: {
          usuarioId: usuarioId,
          tipo: {
            [Op.in]: tipoSimuladoMap[tipo]
          }
        }
      });
      let errorMessage = req.session.errorMessage;
  
      if (errorMessage === null) {
        errorMessage = " ";
      }
  
      req.session.errorMessage = null;
  
      // Retorna os simulados filtrados
      res.status(200).render('professor/criar-questao', { Areas, tipo, simulados, errorMessage,nomeUsuario, perfilUsuario, imagemPerfil });
    } catch (error) {
      console.error(error)
  
      res.status(500).redirect('/usuario/inicioLogado');
    }
  }