const { Flashcard } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Flashcard.destroy({ where: { id_flashcards: id } });
    if (!deleted) throw new Error('Flashcard não encontrado');

    return res.redirect('/flashcards');
  } catch (error) {
    console.error(error);
    if (req.session) {
      req.session.errorMessage = error.message;
      try {
        await new Promise((resolve, reject) =>
          req.session.save(err => (err ? reject(err) : resolve()))
        );
      } catch (_) {}
    }
    return res.status(400).redirect(req.get('Referrer') || '/flashcards');
  }
}