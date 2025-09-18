
const { Router } = require('express');
const validateRequest = require('../middleware/validateRequest');
const { flashcardsSchemas } = require('../validations/schemas');
const { Render } = require("../modules/Render")
const { Database } = require("../modules/Database")

const roteador = Router();

// Page renders
// Removed /selecionar route (no longer needed)
roteador.get('/', Render.flashcards.meusFlashcards);

// Professor UI pages
roteador.get('/criar', Render.flashcards.criarForm);
roteador.get('/:id/editar', Render.flashcards.editarForm);

// // CRUD actions (no /api prefix)
// roteador.get('/', Database.flashcards.getAll);
// API style (JSON)
roteador.post('/criar-flashcard', validateRequest(flashcardsSchemas.register), Database.flashcards.create);
roteador.patch('/:id/editar', validateRequest(flashcardsSchemas.edit), Database.flashcards.update);

// UI style (form submits + redirects)
roteador.post('/criar', validateRequest(flashcardsSchemas.register), Database.flashcards.createUi);
roteador.post('/:id/editar', validateRequest(flashcardsSchemas.edit), Database.flashcards.updateUi);

// Atualizar visto_por_ultimo
roteador.post('/:id_flashcards/visto-por-ultimo', Database.flashcards.updateVistoPorUltimo);

roteador.delete('/:id/excluir', Database.flashcards.delete);
roteador.post('/:id/excluir', Database.flashcards.deleteUi);

module.exports = roteador;
