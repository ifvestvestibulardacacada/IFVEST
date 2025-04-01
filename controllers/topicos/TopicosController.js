const { Topico } = require('../../models');

exports.TopicosController = async (req, res) => {
    const { id } = req.params;
  
    try {
      const topics = await Topico.findAll({
        where: { areaId: id },
        // Selecione apenas os atributos necessários
      });
  
      res.status(200).json(topics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar tópicos' });
    }
  }