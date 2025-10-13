<<<<<<< HEAD
const {Flashcard, FlashcardUsuario, Topico} = require('../../../models');
=======
const {Flashcard, FlashcardUsuario} = require('../../../models');
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)

module.exports = async (req, res) => {
  try {
      const { id_area, id_topico, id_dificuldade, grupo } = req.query;
      const where = {};
      if (id_area && id_area !== "") where.id_area = Number(id_area);
<<<<<<< HEAD
      // Defensive: validate id_topico exists in DB before applying filter
      let validatedTopico = null;
      if (id_topico && id_topico !== "") {
          const found = await Topico.findByPk(Number(id_topico));
          if (found) {
              validatedTopico = Number(id_topico);
              where.id_topico = validatedTopico;
          } else {
              console.warn(`Filtro de tópico inválido recebido: id_topico=${id_topico}. Ignorando filtro.`);
              // User-facing flash message for invalid topic filter
              req.session.errorMessage = 'O tópico selecionado não existe e foi ignorado.';
          }
      }
=======
      if (id_topico && id_topico !== "") where.id_topico = Number(id_topico);
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
      if (id_dificuldade && id_dificuldade !== "") where.id_dificuldade = Number(id_dificuldade);
      const nomeUsuario = req.session.nomeUsuario;
      const perfilUsuario = req.session.perfil;
      const imagemPerfil = req.session.imagemPerfil;
      const id_usuario = req.session.userId;
      let flashcards = await Flashcard.findAll({
          where,
          include: ['Area', 'Topico', 'Dificuldade']
      });
<<<<<<< HEAD
      let groups = { '1': [], '3': [], '7': [], '15': [], '15+': [] };
=======
      let groups = { '1': [], '3': [], '7': [], '15+': [] };
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
      let unseenFlashcards = [];
      let displayFlashcards = [];
      if (id_usuario && perfilUsuario !== "PROFESSOR") {
          // Get all flashcards seen by user with visto_por_ultimo
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
<<<<<<< HEAD
                  else if (daysAgo < 15) groups['15'].push(card);
=======
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
                  else groups['15+'].push(card);
              } else {
                  unseenFlashcards.push(card);
              }
          });

          const shuffle = (arr) => {
              for (let i = arr.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [arr[i], arr[j]] = [arr[j], arr[i]];
              }
              return arr;
          };

          // If a specific group is requested, build the display list from that group(s)
          if (grupo) {
<<<<<<< HEAD
              if (["1", "3", "7", "15", "15+"].includes(grupo)) {
=======
              if (["1", "3", "7", "15+"].includes(grupo)) {
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
                  displayFlashcards = shuffle([...(groups[grupo] || [])]).slice(0, 10);
              } else if (grupo === 'misto') {
                  // Weighted mix by urgency: 15+:4, 7:3, 3:2, 1:1
                  const desired = { '15+': 4, '7': 3, '3': 2, '1': 1 };
                  const order = ['15+', '7', '3', '1'];
                  const picked = [];
                  for (const k of order) {
                      const pool = shuffle([...(groups[k] || [])]);
                      const take = Math.min(desired[k], pool.length);
                      picked.push(...pool.slice(0, take));
                  }
                  // Top up to 10 with remaining groups then with unseen
                  let remaining = 10 - picked.length;
                  if (remaining > 0) {
                      const leftovers = order.flatMap(k => (groups[k] || []).slice(desired[k] || 0));
                      shuffle(leftovers);
                      picked.push(...leftovers.slice(0, remaining));
                      remaining = 10 - picked.length;
                  }
                  if (remaining > 0) {
                      const unseenPool = shuffle([...(unseenFlashcards || [])]);
                      picked.push(...unseenPool.slice(0, remaining));
                  }
                  // Deduplicate by id_flashcards just in case
                  const seenIds = new Set();
                  displayFlashcards = picked.filter(fc => {
                      if (seenIds.has(fc.id_flashcards)) return false;
                      seenIds.add(fc.id_flashcards);
                      return true;
                  }).slice(0, 10);
              }
          }

          // Default: randomize unseen flashcards
          if (!displayFlashcards || displayFlashcards.length === 0) {
              displayFlashcards = shuffle([...(unseenFlashcards || [])]).slice(0, 10);
          }
      }
      if (perfilUsuario === "PROFESSOR") {
<<<<<<< HEAD
          // Captura mensagens da sessão
          const successMessage = req.session.successMessage;
          const errorMessage = req.session.errorMessage;
          delete req.session.successMessage;
          delete req.session.errorMessage;
          
          res.render('professor', { 
              flashcards, 
              nomeUsuario, 
              perfilUsuario, 
              imagemPerfil, 
              id_usuario,
              successMessage,
              errorMessage
          });
      } else {
              // Capture and clear any flash messages in session for student view
              const successMessage = req.session.successMessage;
              const errorMessage = req.session.errorMessage;
              delete req.session.successMessage;
              delete req.session.errorMessage;

              res.render('flashcards', { 
=======
          res.render('professor', { flashcards, nomeUsuario, perfilUsuario, imagemPerfil, id_usuario });
      } else {
          res.render('flashcards', { 
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
              flashcards,
              nomeUsuario,
              perfilUsuario,
              imagemPerfil,
              id_usuario,
              groups,
              unseenFlashcards,
              displayFlashcards,
              selectedGroup: grupo || null,
              id_area: id_area || null,
<<<<<<< HEAD
              id_topico: validatedTopico || null,
              id_dificuldade: id_dificuldade || null,
              isGroupsPage: false, // Flag para identificar página de estudo
              successMessage,
              errorMessage,
=======
              id_topico: id_topico || null,
              id_dificuldade: id_dificuldade || null,
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
          });
      }
  } catch (error) {
      res.status(500).send('Erro ao buscar flashcards.');
  }
}