
const { Router } = require('express');

const { EditorImageUploadController } = require('../controllers/uploads/editorImageUploadController');
const { ProfileImageUploadcontroller } = require('../controllers/uploads/profileImageUploadControllers');

const upload = require('../midlewares/multerConfig');

const roteador = Router();

roteador.post('/', upload.single('image'), ProfileImageUploadcontroller);
roteador.post('/editor', upload.single('image'), EditorImageUploadController);

module.exports = roteador;