const { Questões } = require('../../models');
const { Opcao } = require('../../models');

exports.RegistrarQuestaoController =async (req, res) => {
    try {
        const { titulo, pergunta, areaId, correta, topicosSelecionados, respostasSelecionadas } = req.body;
        const tipo = req.params.tipo.toUpperCase()

        if (!respostasSelecionadas) {
            throw new Error("Respostas não pode ser vazio")
        }


        const ArrayRespostas = JSON.parse(respostasSelecionadas);

        const numOpcoes = Object.keys(ArrayRespostas).length;

        const alternativas = ['A', 'B', 'C', 'D', 'E'];

        const opcoes = alternativas.slice(0, numOpcoes).map(alternativa => ({
            alternativa,
            descricao: ArrayRespostas[`#opcao${alternativa}`]  // Descrição padrão se não existir
        }));

        const usuarioId = req.session.userId;

        if (!topicosSelecionados) {
            throw new Error("Selecione pelo menos um tópico")
        }


        const createQuestao = await Questões.create({
            pergunta: pergunta,
            titulo,
            areaId,
            usuarioId,
            tipo // Usa o novo ID do vestibular
        });


        await createQuestao.addTopicos(topicosSelecionados)

        for (let opcao of opcoes) {
            let isTrue = correta === opcao.alternativa ? true : false;
            await Opcao.create({
                questao_id: createQuestao.id,
                descricao: JSON.stringify(opcao.descricao),
                alternativa: opcao.alternativa,
                correta: isTrue

            })
        }

        res.status(201).redirect('/usuario/inicioLogado');
    } catch (err) {
        console.error(err);
        req.session.errorMessage = err.message;
        res.redirect('back')
    }
}