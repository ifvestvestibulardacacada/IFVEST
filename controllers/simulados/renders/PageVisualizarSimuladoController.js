const { Simulados } = require('../../../models');
const { Questões } = require('../../../models');
const { Usuario } = require('../../../models');
const { Op } = require('sequelize');

exports.PageVisualizarSimuladosController = async (req, res) => {
    try {
      let simulados;
      const perfilUsuario = req.session.perfil;
      const nomeUsuario = req.session.nomeUsuario;
      const imagemPerfil = req.session.imagemPerfil;
  
      const todosSimulados = await Simulados.findAll({
        where: {
          '$Questões.id$': {
            [Op.not]: null
          },
          '$Usuario.perfil$': 'PROFESSOR'
        },
        include: [{
          model: Questões,
          as: 'Questões'
        }, {
          model: Usuario,
          as: 'Usuario',
          attributes: ['perfil'],
          where: {
            perfil: 'PROFESSOR'
          }
        }
        ]
      });
  
      if (!todosSimulados) {
        throw new Error('Simulados não encontrados');
      }
      simulados = todosSimulados;
  
      const tituloBusca = req.query.titulo;
      if (tituloBusca) {
        simulados = todosSimulados.filter(s => s.titulo.toLowerCase().includes(tituloBusca.toLowerCase()));
      }
  
      const tipo = req.query.tipo;
      if (tipo) {
        simulados = todosSimulados.filter(s => s.tipo.includes(tipo));
      }
  
      let errorMessage = req.session.errorMessage;
  
      if (errorMessage === null) {
        errorMessage = " ";
      }
  
      req.session.errorMessage = null;
  
      res.render('simulado/simulados', { simulados, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
    } catch (error) {
      console.error(error);
      res.status(500).send('Ocorreu um erro ao recuperar os questionários.');
    }
  }