const { Simulado, Questao, Opcao } = require('../../../models');
const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
            try {
                const perfilUsuario = req.session.perfil;
                const nomeUsuario = req.session.nomeUsuario;
                const imagemPerfil = req.session.imagemPerfil;
                const simuladoId = req.params.id;
                // Verifique se simuladoId é um número
                console.log(simuladoId);
                if (isNaN(simuladoId) || simuladoId <= 0) {
                    return res.status(400).send('ID de simulado inválido');
                }

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
                console.log("Simulado encontrado:", simulado); // Log para depuração
                res.status(200).json(simulado);
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                res.status(500).send('Erro ao gerar o PDF');
            }
        }

