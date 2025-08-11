const { Op } = require('sequelize');
const { store } = require('../utils/sessionConfig');

const uniqueSession = (store) => async (req, res, next) => {
  if (req.session && req.session.userId && req.sessionID) {
    try {
      const userId = req.session.userId; // Identificador do usuário
      console.log(`Verificando sessões para userId: ${userId}`);

      // Busca todas as sessões
      const sessions = await store.sessionModel.findAll();

      // Itera pelas sessões e deleta as que pertencem ao mesmo userId, exceto a atual
      for (const session of sessions) {
        try {
          const sessionData = JSON.parse(session.data);
          if (sessionData.userId === userId && session.sid !== req.sessionID) {
            await store.sessionModel.destroy({ where: { sid: session.sid } });
            console.log(`Sessão antiga deletada: sid=${session.sid}, userId=${userId}`);
          }
        } catch (err) {
          console.error(`Erro ao parsear sessão ${session.sid}:`, err);
        }
      }

      console.log(`Sessão atual mantida: sid=${req.sessionID}, userId=${userId}`);
    } catch (err) {
      console.error('Erro ao gerenciar sessões únicas:', err);
    }
  }
  next();
};

module.exports = uniqueSession;