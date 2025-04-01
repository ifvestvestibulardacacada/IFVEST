const { Router } = require('express');
const { Usuario } = require('../../models');

exports.DeleteUsuarioController = async (req, res) => {

    const id = req.session.userId;
    try {
      if (id != req.params.id) {
        throw new Error("Erro ao excluir usuario")
      }
  
      await Usuario.destroy({
        where: {
          id: req.params.id
        }
      }
      );
      req.session.destroy();
      res.status(200).redirect('/usuario/login');
    } catch (err) {
      console.log(err)
      req.session.errorMessage = err.message;
      res.redirect('back')
    }
  }