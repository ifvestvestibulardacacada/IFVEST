const { Op } = require("sequelize");
const { Simulado, Questao, Usuario } = require('../../../models');


module.exports = async (req, res) => {
            try {
                let simulados;
     

                const todosSimulados = await Simulado.findAll({
                    where: {
                        '$Questao.id_questao$': {
                            [Op.not]: null
                        },
                        '$Usuario.tipo_perfil$': 'PROFESSOR'
                    },
                    include: [{
                        model: Questao,
                        as: 'Questao'
                    }, {
                        model: Usuario,
                        as: 'Usuario',
                        attributes: ['tipo_perfil'],
                        where: {
                            tipo_perfil: 'PROFESSOR'
                        }
                    }
                    ]
                });

                if (!todosSimulados) {
                    return res.status(400).send('Simulados não encontrados');
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

                res.render('simulado/simulados', { simulados, errorMessage,  });
            } catch (error) {
                console.error(error);
                res.status(500).send('Ocorreu um erro ao recuperar os questionários.');
            }
        }