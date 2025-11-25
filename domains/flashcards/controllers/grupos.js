const { Flashcard, FlashcardUsuario, Topico } = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { id_area, id_topico, id_dificuldade } = req.query;
    const where = {};
    if (id_area && id_area !== "") where.id_area = Number(id_area);
    // Defensive: verify topic exists before adding to where
    let validatedTopico = null;
    if (id_topico && id_topico !== "") {
      const found = await Topico.findByPk(Number(id_topico));
      if (found) {
        validatedTopico = Number(id_topico);
        where.id_topico = validatedTopico;
      } else {
        console.warn(`Filtro de tópico inválido recebido em /grupos: id_topico=${id_topico}. Ignorando.`);
        // set a session-based error message to inform testers/users
        req.session.errorMessage = 'O tópico selecionado não existe e foi ignorado.';
      }
    }
    if (id_dificuldade && id_dificuldade !== "") where.id_dificuldade = Number(id_dificuldade);

   
    const perfilUsuario = req.session.perfil;
      const id_usuario = req.session.userId;

    // Carrega flashcards filtrados
    let flashcards = await Flashcard.findAll({
      where,
      include: ['Area', 'Topico', 'Dificuldade']
    });

    // Agrupar por visto_por_ultimo (apenas alunos)
    let groups = { '1': [], '3': [], '7': [], '15': [], '15+': [] };
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
          else if (daysAgo < 15) groups['15'].push(card);
          else groups['15+'].push(card);
        }
      });
    }

    if (perfilUsuario === 'PROFESSOR') {
      // Professores não usam esta página de grupos; redireciona para a lista
      return res.redirect('/flashcards');
    }

    // capture and clear any flash messages stored in session
    const successMessage = req.session.successMessage;
    const errorMessage = req.session.errorMessage;
    delete req.session.successMessage;
    delete req.session.errorMessage;

    res.render('grupos', {

      id_usuario,
      groups,
      selectedGroup: req.query.grupo || null,
      id_area: id_area || null,
      id_topico: validatedTopico || null,
      id_dificuldade: id_dificuldade || null,
      successMessage,
      errorMessage,
      isGroupsPage: true, // Flag para identificar página de grupos
    });
  } catch (err) {
    res.status(500).send('Erro ao carregar grupos de revisão.');
  }
};
