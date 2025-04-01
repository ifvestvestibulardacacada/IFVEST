const { Opcao } = require('../../../models');
const { Questões } = require('../../../models');
const { Area } = require('../../../models');
const { Topico } = require('../../../models');


exports.PageEditarQuestaoController = async (req, res) => {
    const { id } = req.params;
    const perfilUsuario = req.session.perfil;
    const nomeUsuario = req.session.nomeUsuario;
    const imagemPerfil = req.session.imagemPerfil;
  
    try {
  
      const Topicos = await Topico.findAll()
  
      const Areas = await Area.findAll({
        include: [{
          model: Topico,
          as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
        }]
  
      })
      const questao = await Questões.findByPk(id, {
        include: [{
          model: Opcao,
          as: 'Opcoes' // Certifique-se de que este alias corresponda ao definido na associação
        }, {
          model: Topico,
          as: 'Topicos'
        }]
      });
  
      if (!questao) {
        throw new Error('Questão não encontrada');
      }
  
      const Opcoes = await Opcao.findAll({
        where: {
          questao_id: questao.id
        },
        order: [['alternativa', 'ASC']] // Ordena as opções pela coluna 'alternativa' em ordem ascendente
      });
      const correta = Opcoes.filter(opcao => opcao.correta === true);
  
  
  
      let errorMessage = req.session.errorMessage;
  
      if (errorMessage === null) {
        errorMessage = " ";
      }
  
      req.session.errorMessage = null;
  
      // res.send(JSON.stringify(questao))
      res.render('professor/editar-questao', { questao, Topicos, Areas, errorMessage, Opcoes, correta, nomeUsuario, perfilUsuario, imagemPerfil });
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao buscar questão');
    }
  
  }