const { Router } = require('express');
const { Usuario } = require('../../models');

exports.EditarUsuarioController = async (req, res) => {
    try {
      const id = req.session.userId;
      const idUsuarioParaEditar = Number(req.params.id);
  
      if (id !== idUsuarioParaEditar) {
        req.session.destroy();
      }
  
      const { senha, nome, usuario, email, novasenha } = req.body;
  
      if(!nome & !usuario & !email){
        throw new Error('Um dos campos deve ser preenchido.');
      }
  
      if (senha && novasenha) {
        const usuarioAtual = await Usuario.findByPk(idUsuarioParaEditar);
  
        if (!usuarioAtual) {
          throw new Error('Usuario não encontrado.');
        }
  
        const senhaCorreta = await bcrypt.compare(senha, usuarioAtual.senha);
  
        if (!senhaCorreta) {
          throw new Error('A senha ou usuario atual está incorreto.');
        }
  
        const novaSenhaHash = await bcrypt.hash(novasenha, 10); // Hash da nova senha
  
        if (!novaSenhaHash) {
          throw new Error('Senha não alterada.');
        }
  
        await Usuario.update({ senha: novaSenhaHash }, { where: { id: idUsuarioParaEditar } });
      }
  
     
      nome? await Usuario.update({nome: nome},{ where: { id: idUsuarioParaEditar } }) : "";
      usuario? await Usuario.update({usuario: usuario},{ where: { id: idUsuarioParaEditar } }) : ""; 
      email? await Usuario.update({email: email},{ where: { id: idUsuarioParaEditar } }) : "";
  
  
      res.status(200).redirect(`/usuario/perfil`);
    } catch (err) {
      console.error(err);
      req.session.errorMessage = err.message;
      res.redirect('back')
    }
  }