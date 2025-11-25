const express = require('express');
const router = express.Router();
const { Topico } = require('../models');

/**
 * @route   GET /topicos
 * @desc    Busca todos os tópicos.
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const topicos = await Topico.findAll();
        res.status(200).json(topicos);
    } catch (error) {
        console.error('Erro ao buscar tópicos:', error);
        res.status(500).json({ message: 'Erro interno ao buscar tópicos', error: error.message });
    }
});

/**
 * @route   POST /topicos
 * @desc    Cria um novo tópico.
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        const { nome, materia_id } = req.body;
        if (!nome || !materia_id) {
            return res.status(400).json({ message: 'Nome e materia_id são obrigatórios.' });
        }
        const novoSubtopico = await Topico.create({ nome, materia_id });
        res.status(201).json(novoSubtopico);
    } catch (error) {
        console.error('Erro ao criar tópico:', error);
        res.status(400).json({ message: 'Erro ao criar tópico', error: error.message });
    }
});

// GET /topicos/:id_area - retorna tópicos de uma área específica
router.get('/:id_area', async (req, res) => {
    try {
        const { id_area } = req.params;
        const topicos = await Topico.findAll({ 
            where: { id_area: id_area }, 
            order: [['nome', 'ASC']] 
        });
        res.status(200).json(topicos);
    } catch (error) {
        console.error('Erro ao buscar tópicos por área:', error);
        res.status(500).json({ message: 'Erro ao buscar tópicos por área', error: error.message });
    }
});

module.exports = router;
