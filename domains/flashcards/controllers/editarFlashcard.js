const {Flashcard} = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { pergunta, resposta, id_area, id_topico, id_dificuldade } = req.body;

    const [updated] = await Flashcard.update(
      { pergunta, resposta, id_area, id_topico, id_dificuldade },
      { where: { id_flashcards: id } }
    );

    if (!updated) throw new Error('Flashcard não encontrado');
<<<<<<< HEAD
    
    // Mensagem de sucesso
    if (req.session) {
      req.session.successMessage = 'Flashcard editado com sucesso!';
      try {
        await new Promise((resolve, reject) =>
          req.session.save(err => (err ? reject(err) : resolve()))
        );
      } catch (_) {}
    }
    
=======
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
    return res.redirect('/flashcards');
  } catch (error) {
    console.error(error);
    if (req.session) {
<<<<<<< HEAD
      req.session.errorMessage = error.message || 'Erro ao editar flashcard';
=======
      req.session.errorMessage = error.message;
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
      try {
        await new Promise((resolve, reject) =>
          req.session.save(err => (err ? reject(err) : resolve()))
        );
      } catch (_) {}
    }
    return res.status(400).redirect(req.get('Referrer') || '/flashcards');
  }
}