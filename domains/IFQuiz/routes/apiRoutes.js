const router = require('express').Router();
const db = require('../../../models');
const Placar = db.Placars || db.Placar;


router.get('/placar', async (req, res) => {
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

router.post('/placar', async (req, res) => {
    try {
        const { nome, acertos, totalQuestoes, porcentagem } = req.body;

        if (nome === undefined || acertos === undefined) {
            return res.status(400).json({ error: 'Dados incompletos.' });
        }

        const novoPlacar = await Placar.create({
            nome,
            acertos,
            totalQuestoes,
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