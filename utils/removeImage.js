const fs = require('fs');
const path = require('path');

// Define the upload directory based on environment variable or default to /home/ifvestjc/public_html/uploads
const UPLOADS_DIR = process.env.UPLOADS_DIR || '/home/ifvestjc/public_html/uploads';

function removeFileFromUploads(uploadPath) {
    // Extrai o nome do arquivo da string fornecida
    const fileName = path.basename(uploadPath);

    // Constrói o caminho completo para o arquivo dentro da pasta de uploads
    const filePath = path.join(UPLOADS_DIR, fileName);

    try {
        fs.unlinkSync(filePath); // Usa unlinkSync para remover o arquivo
        console.log(`Arquivo ${filePath} removido com sucesso.`);
    } catch (error) {
        console.error(`Erro ao remover o arquivo ${filePath}:`, error);
    }
}

module.exports = { removeFileFromUploads };