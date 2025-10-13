const { Questao, Simulado } = require('../../../../models');


module.exports = async (req, res) => {
            const { simuladoId } = req.params;

            try {
                const simulado = await Simulado.findByPk(simuladoId, {
                    include: [{
                        model: Questao,
                        as: 'Questao'
                    }]
                });

                if (!simulado) {
                    throw new Error('Simulado não encontrado.');
                }

                await simulado.destroy()

                res.redirect(`/simulados/meus-simulados`);
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                return res.status(400).redirect(req.get("Referrer") || "/");
            }
        }