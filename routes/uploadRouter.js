
const { Router } = require('express');

const upload = require('../midlewares/multerConfig');

const roteador = Router();

const { Database } = require("../modules/Database")

roteador.post('/', upload.single('image'), Database.usuarios.changeImg); // ! ProfileImageUploadcontroller
roteador.post('/editor', upload.single('image'), Database.questoes.addImage); // ! EditorImageUploadController

module.exports = roteador;