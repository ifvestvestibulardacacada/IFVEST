const { Area, Topico, Questao } = require('../../../models');


module.exports = async (req, res) => {

            const usuarioId = req.session.userId;
            const { titulo, areaId, topicosSelecionados, pergunta } = req.query; // 


            try {
                let questoes = await Questao.findAll({
                    where: {
                        id_usuario: usuarioId,
                    },
                    include: [{
                        model: Area,
                        as: 'Area'
                    }, {
                        model: Topico,
                        as: 'Topico'
                    }],
          
                });         
       
                const topicos = await Topico.findAll(); // ! Log temporário
                const Areas = await Area.findAll({
                    include: [{
                        model: Topico,
                        as: 'Topico'
                    }]
                });


                let questoesFiltradas = questoes;
                if (titulo) {
                    questoesFiltradas = questoes.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
                }
                if (areaId && areaId !== "") {
                    questoesFiltradas = questoes.filter(questao => questao.id_area === Number(areaId));
                }
                if (topicosSelecionados && topicosSelecionados !== "") {

                    const topicosIds = Array.isArray(topicosSelecionados) ? topicosSelecionados : topicosSelecionados.split(',').map(id => parseInt(id));
                    questoesFiltradas = questoes.filter(questao => {
                        const topicos = Array.isArray(questao.Topico) ? questao.Topico : [];
                        return topicos.some(topico => topicosIds.includes(topico.id_topico));
                    });
                }
                if (pergunta) {
                    questoesFiltradas = questoes.filter(questao => questao.pergunta.toLowerCase().includes(pergunta.toLowerCase()));
                }

                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;
                res.status(200).render('professor/minhas_questoes', { questoes: questoesFiltradas,  Areas, topicos, errorMessage,  });
            } catch (err) {
                console.log('ERRO NO MINHAS QUESTOES')
                console.error(err.message)
                req.session.destroy();
                res.status(500).redirect('/usuario/inicioLogado');
            };
        }