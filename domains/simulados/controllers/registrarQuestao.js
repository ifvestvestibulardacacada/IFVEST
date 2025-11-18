const { Op } = require("sequelize");
const { Area, Simulado, Topico } = require('../../../models');


module.exports = async (req, res) => {
           try {


                const tipo = req.params.tipo.toLowerCase();
                const usuarioId = req.session.userId;
                //req.session.tipoQuestao = tipo; // Armazena o tipo de questão na sessão

                const Areas = await Area.findAll({
                    include: [{
                        model: Topico,
                        as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
                    }]
                })


                // Mapeamento dos tipos de Questao aos tipos de simulados
                const tipoSimuladoMap = {
                    "objetiva": ['ALEATORIO', 'OBJETIVO'],
                    "dissertativa": ['DISSERTATIVO', 'ALEATORIO']
                };

                // Verifica se o tipo de questão é válido
                if (!tipoSimuladoMap[tipo]) {
                    return res.status(400).send('Tipo de questão inválido');
                }
                const topicos = await Topico.findAll();

                // Consulta todos os simulados do usuário, filtrando por tipo
                const simulados = await Simulado.findAll({
                    where: {
                        id_usuario: usuarioId,
                        tipo: {
                            [Op.in]: tipoSimuladoMap[tipo]
                        }
                    }
                });
                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;

                // Retorna os simulados filtrados
                res.status(200).render('professor/criar_questao', { Areas,topicos, tipo, simulados, errorMessage });
            } catch (error) {
                console.error(error)

                res.status(500).redirect('/usuario/inicioLogado');
            }
        }