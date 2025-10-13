const {Flashcard} = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { pergunta, resposta, id_area, id_topico, id_dificuldade } = req.body;

    await Flashcard.create({ pergunta, resposta, id_area, id_topico, id_dificuldade });
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