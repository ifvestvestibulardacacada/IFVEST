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

module.exports = router;
