const { Resposta } = require('../../models');
const { Simulados } = require('../../models');

exports.ResponderSimuladoController = async (req, res) => {
    const { questoes, respostas } = req.body;
    const { idUsuario } = req.session;
    const { simuladoId } = req.params;
    const respostasDissertativas = respostas;

    const simulado = await Simulados.findByPk(simuladoId)
    try {
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
                    opcaoId: opcaoId,
                    usuarioId: idUsuario, // Ajuste conforme necessário
                    simuladoId: simuladoId, // Ajuste conforme necessário
                    questaoId: questaoId,
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
                    usuarioId: idUsuario, // Ajuste conforme necessário
                    simuladoId: simuladoId, // Ajuste conforme necessário
                    questaoId: questaoId,
                });
            }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));


        res.status(200).redirect(`/simulados/${simulado.id}/gabarito`)


    } catch (error) {
        console.error(error);
        req.session.errorMessage = err.message;
        res.redirect('back')
    }
}