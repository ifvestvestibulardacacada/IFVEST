
const { Router } = require('express');
const {criarFlashcard,
    criarForm,
    editarFlashcard,
    editarForm,
    index,
    home,
    removerFlashcard,
    updateVistoPorUltimo
} = require('./controllers')

const validateRequest = require('../../middleware/validateRequest');
const { flashcardsSchemas } = require('../../validations/schemas');

const router = Router();

router.get('/', home);
router.post('/criar', validateRequest(flashcardsSchemas.register), criarFlashcard);
router.post('/:id/editar', editarFlashcard);
router.post('/:id/excluir', removerFlashcard);


router.get('/criar', criarForm);
router.get('/:id/editar', editarForm);


router.post('/:id_flashcards/visto-por-ultimo', updateVistoPorUltimo);


module.exports = router;