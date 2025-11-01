const { Simulado } = require('../../../../models');


module.exports = async (req, res) => {
            const { simuladoId } = req.params;
            const { selectedQuestionIds } = req.body;

            try {

                const idsInteiros = selectedQuestionIds.split(',').map(Number);
                console.log('IDs das questões selecionadas:', idsInteiros);
                const simulado = await Simulado.findByPk(simuladoId);

                if (!simulado) {
                    throw new Error('Simulado não encontrado.');
                }
                if (!idsInteiros) {
                    throw new Error('Questões não selecionadas.');
                }

                await simulado.addQuestao(idsInteiros);

                return res.status(200).redirect(`/simulados/meus-simulados`);
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