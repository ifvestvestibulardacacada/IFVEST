
const { Router } = require('express');
const {
    criarFlashcard,
    criarForm,
    editarFlashcard,
    editarForm,
    index,
    home,
    grupos,
    removerFlashcard,
    updateVistoPorUltimo
} = require('./controllers')

const router = Router();

router.get('/', home);
router.get('/grupos', grupos);
router.post('/criar', criarFlashcard);
router.post('/:id/editar', editarFlashcard);
router.post('/:id/excluir', removerFlashcard);


router.get('/criar', criarForm);
router.get('/:id/editar', editarForm);


router.post('/:id_flashcards/visto-por-ultimo', updateVistoPorUltimo);


module.exports = router;
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