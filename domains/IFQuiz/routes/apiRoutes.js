const router = require('express').Router();
const db = require('../../../models');
const Placar = db.Placar || db.Placar;


router.get('/Placar', async (req, res) => {
    if (!Placar) {
        return res.status(500).json({ error: "Erro interno: Model Placar não carregado." });
    }

    try {
        const placares = await Placar.findAll({
            order: [
                ['acertos', 'DESC'],
                ['porcentagem', 'DESC']
            ],
            limit: 5
        });
        res.status(200).json(placares);
    } catch (error) {
        console.error('Erro ao buscar placares:', error);
        res.status(500).json({ error: 'Erro ao buscar placares' });
    }
});

router.post('/Placar', async (req, res) => {
    try {
        let { nome, acertos, total_questoes, porcentagem } = req.body;
        if (!nome) {
            if (req.session && req.session.nomeUsuario) {
                nome = req.session.nomeUsuario;
                console.log('✅ Usuário logado identificado:', nome);
            } else {
                nome = 'Visitante';
                console.log('⚠️ Usuário não logado. Salvando como Visitante.');
            }
        }

        if (acertos === undefined) {
            return res.status(400).json({ error: 'Dados de pontuação incompletos.' });
        }

        const novoPlacar = await Placar.create({
            nome,
            acertos,
            total_questoes,
            porcentagem
        });

        console.log('Novo placar salvo:', novoPlacar.toJSON());
        res.status(201).json(novoPlacar);

    } catch (error) {
        console.error('Erro ao salvar placar:', error);
        res.status(500).json({ error: 'Erro ao salvar placar' });
    }
});

module.exports = router;