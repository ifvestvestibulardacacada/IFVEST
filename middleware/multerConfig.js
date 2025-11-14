const multer = require('multer');
const path = require('path');

// Define the upload directory based on environment variable or default to /home/ifvestjc/public_html/uploads
const UPLOADS_DIR = process.env.UPLOADS_DIR || '/home/ifvestjc/public_html/uploads';
console.log('Uploads directory set to:', UPLOADS_DIR);
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function(req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage, array: true });

module.exports = upload;