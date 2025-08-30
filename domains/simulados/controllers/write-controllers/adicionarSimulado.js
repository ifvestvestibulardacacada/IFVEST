const { Simulado } = require('../../../../models');


module.exports = async (req, res) => {
            const { titulo, descricao, tipo, modo, selectedQuestionIds } = req.body;
            const usuarioId = req.session.userId;
            try {

                if (!titulo || !descricao || !tipo ) {
                    return res.status(400).json({ message: 'Dados inválidos: título, descrição, tipo e modo são obrigatórios.' });
                }


                if (!usuarioId) {
                    return res.status(401).json({ message: 'Usuário não autenticado.' });
                }

                if (!selectedQuestionIds || !Array.isArray(selectedQuestionIds) || selectedQuestionIds.length === 0) {
                    return res.status(400).json({ message: 'Nenhuma questão selecionada.' });
                }

                // Format tipo to uppercase
                const tipoFormatado = tipo.toUpperCase();

                // Convert selectedQuestionIds to integers and filter out invalid IDs
                const idsInteiros = selectedQuestionIds
                    .map(id => parseInt(id, 10))
                    .filter(id => !isNaN(id));

                if (idsInteiros.length === 0) {
                    return res.status(400).json({ message: 'IDs de questões inválidos.' });
                }

                // Create simulado
                const simulado = await Simulado.create({
                    titulo,
                    descricao,
                    id_usuario: usuarioId,
                    tipo: tipoFormatado,
                    modo, // Include modo if your model supports it
                });

                if (!simulado) {
                    return res.status(500).json({ message: 'Erro ao criar simulado.' });
                }

                // Associate questions with simulado
                await simulado.addQuestao(idsInteiros);

                // Send success response
                return res.status(201).json({ message: 'Simulado criado com sucesso!' });

            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                return res.status(400).redirect(req.get("Referrer") || "/");
            }
        }