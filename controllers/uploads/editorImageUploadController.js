

exports.EditorImageUploadController = async (req, res) => {
    try {
      // Verifica se uma imagem foi enviada
      if (!req.file) {
        throw new Error('Nenhum arquivo enviado.');
      }
  
      const url = `/uploads/${req.file.filename}`;
  
      // Retorna a URL da imagem como JSON
      res.status(200).json(url);
    } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      res.redirect('back');
    }
  };
  