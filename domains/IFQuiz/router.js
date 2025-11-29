const { Router } = require('express');
const router = Router();


const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

router.use('/', htmlRoutes);       
router.use('/api', apiRoutes);   

module.exports = router;