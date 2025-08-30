const { Area, Topico, Questao } = require('../../../models');

module.exports = async (req, res) => {
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;
            const topicos = await Topico.findAll();
            const Areas = await Area.findAll({
                include: [{
                    model: Topico,
                    as: 'Topico'
                }]
            });
            const questoes = await Questao.findAll({
                include: [
                    {
                        model: Topico,
                        as: 'Topico',
                    },
                ],
                
            });

            let errorMessage = req.session.errorMessage;
            if (errorMessage === null) {
                errorMessage = " ";
            }

            req.session.errorMessage = null;

            res.render('simulado/criar_simulado', { topicos, Areas, questoes, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
        }