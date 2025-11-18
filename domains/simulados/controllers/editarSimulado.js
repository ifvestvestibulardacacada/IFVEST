const { Simulado } = require('../../../models');


module.exports = async (req, res) => {
            const simuladoId = req.params.id

            try {
                const simulado = await Simulado.findOne({
                    where: { id_simulado: simuladoId },
                });

                if (!simulado) {
                    return res.status(400).send('Simulado não encontrado ');
                }
                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }
                req.session.errorMessage = null;

                res.render('simulado/editar_simulado', { simulado, errorMessage,  });
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
        }