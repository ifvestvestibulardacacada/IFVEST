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