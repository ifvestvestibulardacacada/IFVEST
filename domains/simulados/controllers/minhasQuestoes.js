const { Area, Topico, Questao } = require('../../../models');


module.exports = async (req, res) => {
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;
            const usuarioId = req.session.userId;
            const { titulo, areaId, topicosSelecionados, pergunta } = req.query; // 
            const limit = 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

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
                    limit: limit,
                    offset: offset,
                });
                console.log(1) // ! Log temporário

                const questoesCount = await Questao.count({
                    where: {
                        id_usuario: usuarioId,
                    },
                });
                console.log(2) // ! Log temporário
                const totalPages = Math.ceil(questoesCount / limit);
                console.log(3) // ! Log temporário
                // Buscar todas as áreas para o filtro
                const topicos = await Topico.findAll();console.log(4) // ! Log temporário
                const Areas = await Area.findAll({
                    include: [{
                        model: Topico,
                        as: 'Topico'
                    }]
                });


                let questoesFiltradas = questoes;
                if (titulo) {
                    questoesFiltradas = questoes.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
                }console.log(6) // ! Log temporário
                if (areaId && areaId !== "") {
                    questoesFiltradas = questoes.filter(questao => questao.id_area === Number(areaId));
                }
                if (topicosSelecionados && topicosSelecionados !== "") {

                    const topicosIds = Array.isArray(topicosSelecionados) ? topicosSelecionados : topicosSelecionados.split(',').map(id => parseInt(id));
                    questoesFiltradas = questoes.filter(questao => {
                        const topicos = Array.isArray(questao.Topico) ? questao.Topico : [];
                        return topicos.some(topico => topicosIds.includes(topico.id_topico));
                    });
                }console.log(8) // ! Log temporário
                if (pergunta) {
                    questoesFiltradas = questoes.filter(questao => questao.pergunta.toLowerCase().includes(pergunta.toLowerCase()));
                }console.log(9) // ! Log temporário

                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;
                res.status(200).render('professor/minhas_questoes', { questoes: questoesFiltradas, totalPages, page, Areas, topicos, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (err) {
                console.log('ERRO NO MINHAS QUESTOES')
                console.error(err.message)
                req.session.destroy();
                res.status(500).redirect('/usuario/inicioLogado');
            };
        }