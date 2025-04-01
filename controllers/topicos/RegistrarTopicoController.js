const { Topico } = require('../../models');

exports.RegistrarTopicoController = async (req, res) => {
    try {
      const { topico, areaIdTopico } = req.body;
      const usuarioId = req.session.userId;
  
      // Verifica se os campos obrigatórios estão preenchidos
      if (!topico || !areaIdTopico || !usuarioId) {
        throw new Error('Os campos tópico e areaId são obrigatórios.' );
      }
  
      // Cria um novo tópico
      const novoTopico = await Topico.create({
        materia: topico, // Supondo que cada tópico seja uma string
        areaId: areaIdTopico, // Corrigido para usar areaIdTopico
        usuarioId: usuarioId
      });
  
      // Retorna o novo tópico criado como resposta JSON
      return res.status(201).json(novoTopico); // Status 201 para criação bem-sucedida
  
    } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      res.redirect('back')
    }
  }