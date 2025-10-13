const { Router } = require('express');
const validateRequest = require('../middleware/validateRequest');
const { dificuldadesSchemas } = require('../validations/schemas');
const { Render } = require("../modules/Render")
const { Database } = require("../modules/Database")

const router = Router();

// Page render
router.get('/dificuldades', Render.dificuldades.dificuldades);

// CRUD actions
router.get('/', Database.dificuldades.getAll);
router.post('/criar-dificuldade', validateRequest(dificuldadesSchemas.register), Database.dificuldades.create);
router.patch('/:id/editar', validateRequest(dificuldadesSchemas.edit), Database.dificuldades.update);
router.delete('/:id/excluir', Database.dificuldades.delete);

module.exports = router;
