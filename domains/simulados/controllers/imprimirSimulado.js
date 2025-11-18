const { Simulado, Questao, Opcao } = require('../../../models');


module.exports = async (req, res) => {
            try {
  
                const simuladoId = req.params.simuladoId;
                // Verifique se simuladoId é um número
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

                res.render('prova/template_prova', { layoutSemContainer: true, simulado,  });
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                res.status(500).send('Erro ao gerar o PDF');
            }
        }