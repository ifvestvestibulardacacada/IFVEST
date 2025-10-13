const { Questao, Simulado } = require('../../../../models');


module.exports = async (req, res) => {
            const { simuladoId } = req.params;
            const { questoesSelecionadas } = req.body;

            try {
                // Primeiro, verifique se o simulado existe
                const simulado = await Simulado.findByPk(simuladoId, {
                    include: [{
                        model: Questao,
                        as: 'Questao'
                    }]
                });

                if (!simulado) {
                    throw new Error('Simulado não encontrado.');
                }
                if (!questoesSelecionadas || questoesSelecionadas.length === 0) {
                    throw new Error('Questões não selecionadas.');
                }

                await simulado.removeQuestao(questoesSelecionadas);

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