
const { Router } = require('express');
const validateRequest = require('../middleware/validateRequest');
const { flashcardsSchemas } = require('../validations/schemas');
const { Render } = require("../modules/Render")
const { Database } = require("../modules/Database")

const roteador = Router();

// Page renders
roteador.get('/selecionar', Render.flashcards.selecionar);
roteador.get('/', Render.flashcards.meusFlashcards);

// // CRUD actions (no /api prefix)
// roteador.get('/', Database.flashcards.getAll);
roteador.post('/criar-flashcard', validateRequest(flashcardsSchemas.register), Database.flashcards.create);
roteador.patch('/:id/editar', validateRequest(flashcardsSchemas.edit), Database.flashcards.update);
roteador.delete('/:id/excluir', Database.flashcards.delete);

module.exports = roteador;
