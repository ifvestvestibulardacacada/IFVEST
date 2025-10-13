const { Simulado, Resposta } = require('../../../../models');


module.exports = async (req, res) => {
            const { questoes, respostas } = req.body;
            const { userId } = req.session;
            const { simuladoId } = req.params;
            const respostasDissertativas = respostas;

            try {
                const simulado = await Simulado.findByPk(simuladoId)

                if (!simulado) {
                    throw new Error('Simulado nao encontrado.');
                }

                if (questoes && Object.keys(questoes).length > 0) {

                    const questoesObj = questoes.reduce((acc, item) => {
                        const [questaoId, opcaoId] = item.split('-');
                        acc[questaoId] = opcaoId;
                        return acc;
                    }, {});



                    for (let questaoId in questoesObj) {
                        const opcaoId = questoesObj[questaoId];

                        await Resposta.create({
                            resposta: "", // O ID da opção é salvo no campo resposta
                            tipo: 'OBJETIVA',
                            id_opcao: opcaoId,
                            id_usuario: userId, // Ajuste conforme necessário
                            id_simulado: simuladoId, // Ajuste conforme necessário
                            id_questao: questaoId,
                        });
                    }
                }

                // Processa as respostas dissertativas, se houver
                if (respostasDissertativas && Object.keys(respostasDissertativas).length > 0) {
                    for (let key in respostasDissertativas) {
                        const questaoId = key.replace('questao_', '');
                        const resposta = respostasDissertativas[key];

                        await Resposta.create({
                            resposta: resposta,
                            tipo: 'DISSERTATIVA',
                            id_usuario: userId, // Ajuste conforme necessário
                            id_simulado: simuladoId, // Ajuste conforme necessário
                            id_questao: questaoId,
                        });
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 1000));


                res.status(200).redirect(`/simulados/${simulado.id_simulado}/gabarito`)


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