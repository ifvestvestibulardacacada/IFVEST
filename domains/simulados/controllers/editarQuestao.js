const { Area, Topico, Questao, Opcao } = require('../../../models');


module.exports = async (req, res) => {
            const { id } = req.params;
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;

            try {



                const Areas = await Area.findAll({
                    include: [{
                        model: Topico,
                        as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
                    }]

                })
                const questao = await Questao.findByPk(id, {
                    include: [{
                        model: Opcao,
                        as: 'Opcao' // Certifique-se de que este alias corresponda ao definido na associação
                    }, {
                        model: Topico,
                        as: 'Topico'
                    }]
                });
                const Topicos = await Topico.findAll(
                    {
                        where: {
                            id_area: questao.id_area
                        }
                    }
                )


                if (!questao || !Topicos || !Areas) {
                    return res.status(400).send('Dados não encontrados');
                }

                const Opcoes = await Opcao.findAll({
                    where: {
                        id_questao: questao.id_questao
                    },
                    order: [['alternativa', 'ASC']] // Ordena as opções pela coluna 'alternativa' em ordem ascendente
                });

                if (!Opcoes) {
                    return res.status(400).send('Dados não encontrados');
                }

                const correta = Opcoes.filter(opcao => opcao.correta === true);

                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;

                // res.send(JSON.stringify(questao))
                res.render('professor/editar_questao', { questao, Topicos, Areas, errorMessage, Opcoes, correta, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (error) {
                console.error(error);
                res.status(500).send('Erro ao buscar questão');
            }
        }