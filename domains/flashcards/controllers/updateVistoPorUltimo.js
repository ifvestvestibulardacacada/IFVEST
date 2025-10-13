const { FlashcardUsuario } = require('../../../models');

module.exports = async (req, res) => {
  const { id_flashcards } = req.params;
    const id_usuario = req.user?.id_usuario || req.body.id_usuario;
    if (!id_usuario) {
        return res.status(400).json({ message: 'Usuário não autenticado.' });
    }
    try {
        // Get Brazil time (BRT, UTC-3)
        const now = new Date();
        const brtDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
        const [record, created] = await FlashcardUsuario.findOrCreate({
            where: { id_usuario, id_flashcards },
            defaults: { visto_por_ultimo: brtDate }
        });
        if (!created) {
            record.visto_por_ultimo = brtDate;
            await record.save();
        }
        return res.status(200).json({ visto_por_ultimo: record.visto_por_ultimo });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao atualizar visto_por_ultimo', error: error.message });
    }
}