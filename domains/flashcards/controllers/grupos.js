const { Flashcard, FlashcardUsuario } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id_area, id_topico, id_dificuldade } = req.query;
    const where = {};
    if (id_area && id_area !== "") where.id_area = Number(id_area);
    if (id_topico && id_topico !== "") where.id_topico = Number(id_topico);
    if (id_dificuldade && id_dificuldade !== "") where.id_dificuldade = Number(id_dificuldade);

    const nomeUsuario = req.session.nomeUsuario;
    const perfilUsuario = req.session.perfil;
    const imagemPerfil = req.session.imagemPerfil;
    const id_usuario = req.session.userId;

    // Carrega flashcards filtrados
    let flashcards = await Flashcard.findAll({
      where,
      include: ['Area', 'Topico', 'Dificuldade']
    });

    // Agrupar por visto_por_ultimo (apenas alunos)
    let groups = { '1': [], '3': [], '7': [], '15+': [] };
    if (id_usuario && perfilUsuario !== 'PROFESSOR') {
      const seen = await FlashcardUsuario.findAll({
        where: { id_usuario },
        attributes: ['id_flashcards', 'visto_por_ultimo']
      });
      const now = new Date();
      flashcards.forEach(card => {
        const seenEntry = seen.find(s => s.id_flashcards === card.id_flashcards && s.visto_por_ultimo);
        if (seenEntry) {
          const daysAgo = Math.floor((now - new Date(seenEntry.visto_por_ultimo)) / (1000 * 60 * 60 * 24));
          if (daysAgo < 1) groups['1'].push(card);
          else if (daysAgo < 3) groups['3'].push(card);
          else if (daysAgo < 7) groups['7'].push(card);
          else groups['15+'].push(card);
        }
      });
    }

    if (perfilUsuario === 'PROFESSOR') {
      // Professores não usam esta página de grupos; redireciona para a lista
      return res.redirect('/flashcards');
    }

    res.render('grupos', {
      nomeUsuario,
      perfilUsuario,
      imagemPerfil,
      id_usuario,
      groups,
      selectedGroup: req.query.grupo || null,
      id_area: id_area || null,
      id_topico: id_topico || null,
      id_dificuldade: id_dificuldade || null,
      isGroupsPage: true, // Flag para identificar página de grupos
    });
  } catch (err) {
    res.status(500).send('Erro ao carregar grupos de revisão.');
  }
};
