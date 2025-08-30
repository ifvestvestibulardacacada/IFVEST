const { Simulado, Questao, Opcao } = require('../../../models');


module.exports = async (req, res) => {
            try {
                const perfilUsuario = req.session.perfil;
                const nomeUsuario = req.session.nomeUsuario;
                const imagemPerfil = req.session.imagemPerfil;
                const simuladoId = req.params.simuladoId;
                let errorMessage = req.session.errorMessage;

                const simulado = await Simulado.findByPk(simuladoId, {
                    include: [{
                        model: Questao,
                        as: 'Questao', // Certifique-se de que este alias corresponda ao definido na associação
                        include: [{
                            model: Opcao,
                            as: 'Opcao' // Certifique-se de que este alias corresponda ao definido na associação
                        },
                        ]
                    }],

                });

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;



                res.render('prova/prova', { simulado, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
                //  res.send(simulado)
            } catch (error) {
                console.error('Erro ao buscar perguntas da prova:', error);
                res.status(500).send('Erro ao buscar perguntas da prova.');
            }
        }