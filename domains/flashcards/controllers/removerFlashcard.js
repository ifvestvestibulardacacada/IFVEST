const { Flashcard } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Flashcard.destroy({ where: { id_flashcards: id } });
    if (!deleted) throw new Error('Flashcard não encontrado');

<<<<<<< HEAD
    // Mensagem de sucesso
    if (req.session) {
      req.session.successMessage = 'Flashcard excluído com sucesso!';
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
      req.session.errorMessage = error.message || 'Erro ao excluir flashcard';
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