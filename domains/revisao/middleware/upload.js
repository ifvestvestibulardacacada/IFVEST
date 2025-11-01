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
    },
})

const fileFilter = (req, file, cb) => {
        console.log('File data:', file)
        const allowedTypes = ['application/pdf']
        console.log('incoming file type: ', file.mimetype)
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Tipo de arquivo inválido. Apenas PDFs são permitidos.'), false)
        }
    }

const upload = multer({ storage: storage, array: true, fileFilter: fileFilter})

module.exports = upload