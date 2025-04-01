const { Usuario } = require('../../models');
const { removeFileFromUploads } = require('../../utils/removeImage')


exports.ProfileImageUploadcontroller = async (req, res) => {
    try {
      // Verifica se uma imagem foi enviada
      if (!req.file) {
        throw new Error('Nenhum arquivo enviado.');
      }
  
      const idUsuario = req.session.userId;
      const caminhoImagem = `/uploads/${req.file.filename}`;
  
      // Obtém o usuário atual
      const usuario = await Usuario.findByPk(idUsuario);
  
      // Remove a imagem antiga se existir
      if (usuario.imagemPerfil) {
        removeFileFromUploads(usuario.imagemPerfil);
      }
  
      // Verifica se uma nova imagem foi recebida
      if (!caminhoImagem) {
        throw new Error('Nenhum arquivo enviado.');
      }
  
      // Atualiza o banco de dados com a nova imagem
      await Usuario.update({ imagemPerfil: caminhoImagem }, { where: { id: idUsuario } });
  
      // Atualiza a sessão com a nova imagem
      req.session.imagemPerfil = caminhoImagem;
  
      // Redireciona para a página de perfil
      res.status(200).redirect(`/usuario/perfil`);
    } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      res.redirect('back');
    }
  }