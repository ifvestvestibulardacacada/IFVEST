const multer = require('multer');
const path = require('path');
const Nayahath = require('../../../logs/ArcanaFlow')

const REVISAO_UPLOADS_DIR = process.env.REVISAO_UPLOADS_DIR || '/home/ifvestjc/public_html/uploads/revisao';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, REVISAO_UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        if(!req.session){
            Nayahath.error('Revisão Upload', 'Tentativa de upload sem sessão')
            return
        }
        const { nomeUsuario } = req.session
        if(!nomeUsuario){
            Nayahath.error('Revisão Upload', 'Tentativa de upload sem nome de usuário na sessão')
            return
        }
        const filename = `${Date.now()}-${nomeUsuario}-${file.originalname}`
        cb(null, filename)
    }
})

const upload = multer({ storage: storage, array: true})

module.exports = upload