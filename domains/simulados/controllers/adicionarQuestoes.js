const { Simulado, Questao, Topico, Area } = require('../../../models');
const { Op } = require('sequelize');

// controller (substitua o atual)
module.exports = async (req, res) => {
    try {
        const perfilUsuario = req.session.perfil;
        const nomeUsuario = req.session.nomeUsuario;
        const imagemPerfil = req.session.imagemPerfil;
        const simuladoId = req.params.simuladoId;
        const { titulo, areaId, topicosSelecionados } = req.query;

        const simulado = await Simulado.findOne({
            where: { id_simulado: simuladoId },
            include: [{
                model: Questao,
                as: 'Questao'
            }]
        });

        if (!simulado) {
            return res.status(400).send('Simulado não encontrado.');
        }

        const topicos = await Topico.findAll();
        const Areas = await Area.findAll({
            include: [{ model: Topico, as: 'Topico' }]
        });

        const tipoQuestao = simulado.tipo === "OBJETIVO" ? 'OBJETIVA' :
            simulado.tipo === "DISSERTATIVO" ? 'DISSERTATIVA' : null;

        const whereClause = tipoQuestao ? { tipo: tipoQuestao } : {};

        const todasQuestoes = await Questao.findAll({
            include: [{
                model: Topico,
                as: 'Topico',
                through: { attributes: [] },
            }],
            where: whereClause,
        });

        const questoesJaAssociadas = simulado.Questao.map(q => q.id_questao);
        const questoesDisponiveis = todasQuestoes.filter(q => !questoesJaAssociadas.includes(q.id_questao));

        // Aplicar filtros no backend (mas sem paginação)
        let questoesFiltradas = questoesDisponiveis;

        if (titulo) {
            questoesFiltradas = questoesFiltradas.filter(q => 
                q.titulo.toLowerCase().includes(titulo.toLowerCase())
            );
        }
        if (areaId && areaId !== "") {
            questoesFiltradas = questoesFiltradas.filter(q => q.id_area === Number(areaId));
        }
        if (topicosSelecionados && topicosSelecionados !== "") {
            const topicosIds = Array.isArray(topicosSelecionados) 
                ? topicosSelecionados.map(Number) 
                : topicosSelecionados.split(',').map(Number);
            questoesFiltradas = questoesFiltradas.filter(q => {
                return q.Topico.some(t => topicosIds.includes(t.id_topico));
            });
        }

        // Contar questões por área (já associadas)
        const questoesPorArea = {};
        simulado.Questao.forEach(q => {
            const areaId = q.id_area;
            questoesPorArea[areaId] = (questoesPorArea[areaId] || 0) + 1;
        });

        const errorMessage = req.session.errorMessage || '';
        req.session.errorMessage = null;

        // Enviar TODAS as questões filtradas para o frontend
        res.render('simulado/associar_pergunta_simulado', {
            simulado,
            questoes: questoesFiltradas, // ← todas as filtradas
            Areas,
            topicos,
            questoesPorArea,
            errorMessage,
            nomeUsuario,
            perfilUsuario,
            imagemPerfil,
            // Variáveis para JS
            titulo: titulo || '',
            areaId: areaId || '',
            topicosSelecionados: topicosSelecionados || ''
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar formulário de associação de pergunta');
    }
};