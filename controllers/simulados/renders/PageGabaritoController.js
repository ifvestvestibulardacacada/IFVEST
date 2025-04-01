const { Simulados } = require('../../../models');
const { Questões } = require('../../../models');
const { Opcao } = require('../../../models');
const { Resposta } = require('../../../models');
exports.PageGabaritoController = async (req, res) => {
  const perfilUsuario = req.session.perfil;
  const nomeUsuario = req.session.nomeUsuario;
  const imagemPerfil = req.session.imagemPerfil;
    const userId = req.session.userId;
    const simuladoId = req.params.simuladoId;
    try {
      const simulado = await Simulados.findByPk(simuladoId, {
        include: [{
          model: Questões,
          as: 'Questões',
          include: [{
            model: Opcao,
            as: 'Opcoes',
            // Inclui apenas as opções corretas
          },
          ]
        }],
      })
      
      if(simulado.tipo !== 'OBJETIVO'){
        res.redirect('/professor/manutencao')
      }
  
      const questoesComOpcoesCorretas = simulado.Questões;
  
      // Consulta as respostas do usuário para cada questão
      const respostasDoUsuario = await Resposta.findAll({
        where: {
          usuarioId: userId,
          questaoId: { [Op.in]: questoesComOpcoesCorretas.map(q => q.id) }
        },
        include: [{
          model: Opcao,
          as: 'opcao',
          required: true
        }],
        order: [['createdAt', 'DESC']],
      });
  
  
      // Prepara os dados para a view
  
      let errorMessage = req.session.errorMessage;
  
      if (errorMessage === null) {
        errorMessage = " ";
      }
  
      req.session.errorMessage = null;
  
      // Renderiza a view com os dados preparados
      res.render('prova/gabarito', {     questoes: questoesComOpcoesCorretas,
        respostasUsuario: respostasDoUsuario,
        simulado: simulado, errorMessage,
        nomeUsuario, perfilUsuario, imagemPerfil });
  
      //  res.render('prova/gabaritoProva', { simulado });
  
    } catch (error) {
      console.error('Erro ao buscar o gabarito da prova:', error);
      res.status(500).send('Erro ao buscar o gabarito da prova.');
    }
  }