const { Topico } = require('../../models');

exports.EditarTopicoController = async (req, res) => {
    try {
      const { id, materia } = req.body;
      // Encontre o tópico pelo ID
      const topico = await Topico.findByPk(id);
      if (!topico) {
        return res.status(404).send('Tópico não encontrado.');
      }
      // Atualize o tópico com a nova matéria
      await topico.update({ materia });
      res.redirect('/professor/topicos');
    } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      res.redirect('back')
    }
  }