const { Op } = require("sequelize");
const { Simulado, Questao, Opcao, Resposta } = require('../../../models');



module.exports = async (req, res) => {
     
    const userId = req.session.userId;
    const id_simulado = req.params.simuladoId;
    let respostasDissertativas = [];

    if (isNaN(id_simulado) || id_simulado <= 0) {
        return res.status(400).send('ID de simulado inválido');
    }

    try {
        const simulado = await Simulado.findByPk(id_simulado, {
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

        const questoesComOpcoesCorretas = simulado.Questao;

        if (!questoesComOpcoesCorretas) {
            return res.status(400).send('Nenhuma questão encontrada');
        }

        // Esta busca já traz as respostas OBJETIVAS do usuário
        const respostasDoUsuario = await Resposta.findAll({
            where: {
                id_usuario: userId,
                id_questao: { [Op.in]: questoesComOpcoesCorretas.map(q => q.id_questao) },
                id_opcao: { [Op.ne]: null } // Garante que são respostas objetivas
            },
            include: [{
                model: Opcao,
                as: 'Opcao',
                required: true // Ótimo! Isso já garante que só vêm respostas com opção
            }],
            order: [['createdAt', 'DESC']],
        });

        // Esta busca traz as respostas DISSERTATIVAS
        if (simulado.tipo !== 'OBJETIVO') {
            respostasDissertativas = await Resposta.findAll({
                where: {
                    id_usuario: userId,
                    id_questao: { [Op.in]: questoesComOpcoesCorretas.map(q => q.id_questao) },
                    resposta: { [Op.ne]: null } // Garante que são respostas dissertativas
                },
                order: [['createdAt', 'DESC']],
            });
        } else {
            respostasDissertativas = [];
        }

        questoesComOpcoesCorretas.forEach(questao => {
            questao.Opcao.sort((a, b) => a.id_opcao - b.id_opcao);
        });

        // ===================================================
        //     INÍCIO: LÓGICA DE CÁLCULO DO PLACAR
        // ===================================================

        // 1. Calcular acertos:
        // Iteramos sobre as respostas objetivas que o usuário deu ('respostasDoUsuario').
        // A 'Opcao' que ele marcou já foi incluída na busca.
        // Se a 'Opcao' incluída tiver 'correta === true', somamos 1.
        let totalAcertos = 0;
        respostasDoUsuario.forEach(resposta => {
            // O 'include' com 'required: true' garante que resposta.Opcao existe
            if (resposta.Opcao && resposta.Opcao.correta === true) {
                totalAcertos++;
            }
        });

        // 2. Calcular total de questões objetivas:
        // Filtramos a lista de todas as questões ('questoesComOpcoesCorretas')
        // para contar apenas as do tipo "OBJETIVA".
        const questoesObjetivas = questoesComOpcoesCorretas.filter(q => q.tipo === "OBJETIVA");
        let totalQuestoes = questoesObjetivas.length;

        // ===================================================
        //       FIM: LÓGICA DE CÁLCULO DO PLACAR
        // ===================================================


        let errorMessage = req.session.errorMessage;

        if (errorMessage === null) {
            errorMessage = " ";
        }

        req.session.errorMessage = null;

        // ATUALIZADO: Adicionamos as novas variáveis ao render
        res.render('prova/gabarito', {
            questoes: questoesComOpcoesCorretas,
            respostasUsuario: respostasDoUsuario,
            respostasDissertativas: respostasDissertativas,
            simulado: simulado, 
            errorMessage,
            
            // --- NOVAS VARIÁVEIS ADICIONADAS ---
            totalAcertos: totalAcertos,
            totalQuestoes: totalQuestoes
            // -----------------------------------
        });


    } catch (error) {
        console.error('Erro ao buscar o gabarito da prova:', error);
        res.status(500).send('Erro ao buscar o gabarito da prova.');
    }
}